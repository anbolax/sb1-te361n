import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Navigation from '../components/Navigation';
import FileCarousel from '../components/FileCarousel';
import FileModal from '../components/FileModal';
import axios from 'axios';
import { format } from 'date-fns';
import { Object, PaginatedResponse } from '../types';

interface FileWithComment {
  file: File;
  comment: string;
  tempId: string;
}

interface FormData {
  fullName: string;
  amount: string;
  reason: string;
  location: string;
  date: string;
  objectId: string;
}

const PREDEFINED_REASONS = [
  'Late arrival',
  'Missing documentation',
  'Safety violation',
  'Quality issues',
  'Other'
];

export default function NewFine() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [objects, setObjects] = useState<Object[]>([]);
  const [isLoadingObjects, setIsLoadingObjects] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [showCustomReasonInput, setShowCustomReasonInput] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    amount: '',
    reason: '',
    location: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    objectId: '',
  });

  const [files, setFiles] = useState<FileWithComment[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchObjects = async () => {
      setIsLoadingObjects(true);
      try {
        const response = await axios.get<PaginatedResponse<Object>>(
          'https://api.miniapp.ruqi.pro/api/v1/objects/list'
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []).map(file => ({
      file,
      comment: '',
      tempId: uuidv4(),
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleFileDelete = (tempId: string) => {
    setFiles(files.filter(f => f.tempId !== tempId));
    if (selectedFile === tempId) {
      setSelectedFile(null);
    }
  };

  const handleCommentChange = (tempId: string, comment: string) => {
    setFiles(files.map(f => 
      f.tempId === tempId ? { ...f, comment } : f
    ));
  };

  const handleReasonSelect = (reason: string) => {
    if (reason === 'Other') {
      setShowCustomReasonInput(true);
      setFormData({ ...formData, reason: '' });
    } else {
      setShowCustomReasonInput(false);
      setFormData({ ...formData, reason });
    }
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

      const accrualItems = [{
        temp_id: uuidv4(),
        accrual_item_category_id: 1,
        employee: {
          fio: formData.fullName,
        },
        user_id: 1,
        comment: showCustomReasonInput ? customReason : formData.reason,
        sum_accrual: parseFloat(formData.amount),
      }];

      formDataToSend.append('accrual_items', JSON.stringify(accrualItems));

      const filesData: Record<string, { path: string; comment: string }> = {};
      files.forEach(({ file, comment, tempId }) => {
        formDataToSend.append(`file_${tempId}`, file);
        filesData[`file_${tempId}`] = {
          path: file.name,
          comment,
        };
      });

      formDataToSend.append('files', JSON.stringify(filesData));

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
    ? files.find(f => f.tempId === selectedFile)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto px-4 pt-6 pb-32">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Object
            </label>
            <select
              value={formData.objectId}
              onChange={(e) => setFormData({ ...formData, objectId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoadingObjects}
            >
              <option value="">Select an object</option>
              {objects.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason
            </label>
            <div className="relative">
              <select
                value={formData.reason}
                onChange={(e) => handleReasonSelect(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                required={!showCustomReasonInput}
              >
                <option value="">Select a reason</option>
                {PREDEFINED_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
            </div>
          </div>

          {showCustomReasonInput && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Reason
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter custom reason"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attachments
            </label>
            
            {files.length > 0 && (
              <div className="mb-4">
                <FileCarousel
                  files={files}
                  onFileDelete={handleFileDelete}
                  onCommentChange={handleCommentChange}
                  onFileClick={setSelectedFile}
                />
              </div>
            )}

            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating...' : 'Create Fine'}
          </button>
        </form>

        {selectedFileData && (
          <FileModal
            file={selectedFileData.file}
            comment={selectedFileData.comment}
            onClose={() => setSelectedFile(null)}
            onCommentChange={(comment) => handleCommentChange(selectedFileData.tempId, comment)}
            onDelete={() => handleFileDelete(selectedFileData.tempId)}
          />
        )}
      </div>
      <Navigation />
    </div>
  );
}