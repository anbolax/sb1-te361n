import React, {useEffect, useState} from 'react';
import {ArrowLeft, Plus} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import Navigation from '../components/Navigation';
import FileModal from '../components/File/FileModal';
import axios from 'axios';
import {format} from 'date-fns';
import {Executor, ExecutorFormData, Object, PaginatedResponse} from "../types/index";
import {DateInput} from "../components/Inputs/DateInput";
import {SelectInput} from "../components/Inputs/SelectInput";
import ExecutorForm from "../components/ExecutorForm";

export default function NewFine() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [objects, setObjects] = useState<Object[]>([]);
  const [isLoadingObjects, setIsLoadingObjects] = useState(false);
  const [customReasons, setCustomReasons] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExecutorFormData>({
    fullName: "",
    comment: "",
    reason: "",
    sum: "",
    date: format(new Date(), 'yyyy-MM-dd'),
    objectId: '',
    executors: [createNewExecutor()]
  });

  function createNewExecutor(): Executor {
    return {
      id: uuidv4(),
      fullName: '',
      sum: '',
      reason: '',
      comment: "",
      files: []
    };
  }

  useEffect(() => {
    const fetchObjects = async () => {
      setIsLoadingObjects(true);
      try {
        const config = {
          headers: { 'Init-Data': 'dev' }
        };
        const response = await axios.get<PaginatedResponse<Object>>(
            'https://api.miniapp.ruqi.pro/api/v1/objects/list',
            config
        );
        setObjects(response.data.data);
      } catch (err) {
        console.error('Failed to fetch objects:', err);
      } finally {
        setIsLoadingObjects(false);
      }
    };

    fetchObjects();
  }, []);

  const handleExecutorChange = (executorId: string, field: keyof Executor, value: string) => {
    setFormData(prev => ({
      ...prev,
      executors: prev.executors.map(executor =>
          executor.id === executorId ? { ...executor, [field]: value } : executor
      )
    }));
  };

  const handleFileChange = (executorId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []).map(file => ({
      file,
      comment: '',
      tempId: uuidv4(),
      executorId
    }));

    setFormData(prev => ({
      ...prev,
      executors: prev.executors.map(executor =>
          executor.id === executorId
              ? { ...executor, files: [...executor.files, ...newFiles] }
              : executor
      )
    }));
  };

  const handleFileDelete = (executorId: string, tempId: string) => {
    setFormData(prev => ({
      ...prev,
      executors: prev.executors.map(executor =>
          executor.id === executorId
              ? { ...executor, files: executor.files.filter(f => f.tempId !== tempId) }
              : executor
      )
    }));

    if (selectedFile === tempId) {
      setSelectedFile(null);
    }
  };

  const handleCommentChange = (executorId: string, tempId: string, comment: string) => {
    setFormData(prev => ({
      ...prev,
      executors: prev.executors.map(executor =>
          executor.id === executorId
              ? {
                ...executor,
                files: executor.files.map(f =>
                    f.tempId === tempId ? { ...f, comment } : f
                )
              }
              : executor
      )
    }));
  };

  const handleReasonSelect = (executorId: string, reason: string) => {
    if (reason == '0') {
      setCustomReasons(prev => ({ ...prev, [executorId]: '' }));
      handleExecutorChange(executorId, 'reason', '');
    } else {
      setCustomReasons(prev => {
        const newReasons = { ...prev };
        delete newReasons[executorId];
        return newReasons;
      });
      handleExecutorChange(executorId, 'reason', reason);
    }
  };

  const addExecutor = () => {
    setFormData(prev => ({
      ...prev,
      executors: [...prev.executors, createNewExecutor()]
    }));
  };

  const removeExecutor = (executorId: string) => {
    setFormData(prev => ({
      ...prev,
      executors: prev.executors.filter(executor => executor.id !== executorId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('type', 'penalty');
      formDataToSend.append('status', 'created');
      formDataToSend.append('accrual_date', formData.date);
      formDataToSend.append('object_id', formData.objectId);

      const accrualItems = formData.executors.map(executor => ({
        temp_id: executor.id,
        accrual_item_category_id: 1,
        employee: {
          fio: executor.fullName,
        },
        user_id: 1,
        comment: customReasons[executor.id] || executor.reason,
        sum_accrual: parseFloat(executor.sum),
      }));

      formDataToSend.append('accrual_items', JSON.stringify(accrualItems));

      const filesData: Record<string, { path: string; comment: string }> = {};
      formData.executors.forEach((executor, executorIndex) => {
        executor.files.forEach((fileData, fileIndex) => {
          const fileKey = `file_item_accrual_item_${executor.id}_file_${fileIndex + 1}`;
          const commentKey = `file_comment_accrual_item_${executor.id}_file_${fileIndex + 1}`;

          formDataToSend.append(fileKey, fileData.file);
          filesData[fileKey] = {
            path: fileData.file.name,
            comment: fileData.comment,
          };

          if (fileData.comment) {
            formDataToSend.append(commentKey, fileData.comment);
          }
        });
      });

      // formDataToSend.append('files', JSON.stringify(filesData));

      await axios.post('https://api.miniapp.ruqi.pro/api/v1/accruals', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedFileData = selectedFile
      ? formData.executors
          .flatMap(executor => executor.files)
          .find(f => f.tempId === selectedFile)
      : null;

  const objectOptions = objects.map(obj => ({
    value: obj.id,
    label: obj.code
  }));

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto px-4 pt-6 pb-32">
          <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 dark:text-gray-300 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад
          </button>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Create New Fine
          </h1>

          {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <DateInput
                label="Дата штрафа"
                value={formData.date}
                onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                required
            />

            <SelectInput
                label="Объект"
                value={formData.objectId}
                options={objectOptions}
                onChange={(objectId) => setFormData(prev => ({ ...prev, objectId }))}
                required
                disabled={isLoadingObjects}
                placeholder="Выберите объект"
            />

            {formData.executors.map((executor, index) => (
                <ExecutorForm
                    key={executor.id}
                    executor={executor}
                    index={index}
                    showDelete={formData.executors.length > 1}
                    customReason={customReasons[executor.id]}
                    onExecutorChange={handleExecutorChange}
                    onFileChange={handleFileChange}
                    onFileDelete={handleFileDelete}
                    onCommentChange={handleCommentChange}
                    onReasonSelect={handleReasonSelect}
                    onCustomReasonChange={(executorId, reason) =>
                        setCustomReasons(prev => ({ ...prev, [executorId]: reason }))
                    }
                    onDelete={removeExecutor}
                    onFileClick={setSelectedFile}
                />
            ))}

            <button
                type="button"
                onClick={addExecutor}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить исполнителя
            </button>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Создание...' : 'Создать штраф'}
            </button>
          </form>

          {selectedFileData && (
              <FileModal
                  file={selectedFileData.file}
                  comment={selectedFileData.comment}
                  onClose={() => setSelectedFile(null)}
                  onCommentChange={(comment) => handleCommentChange(selectedFileData.executorId, selectedFileData.tempId, comment)}
                  onDelete={() => handleFileDelete(selectedFileData.executorId, selectedFileData.tempId)}
              />
          )}
        </div>
        <Navigation />
      </div>
  );
}