import React from 'react';
import { Trash2 } from 'lucide-react';
import { Executor } from '../types';
import { TextInput } from './Inputs/TextInput';
import { SelectInput } from './Inputs/SelectInput';
import { FileInput } from './Inputs/FileInput';

interface ExecutorFormProps {
    executor: Executor;
    index: number;
    showDelete: boolean;
    customReason: string | undefined;
    onExecutorChange: (executorId: string, field: string, value: string) => void;
    onFileChange: (executorId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    onFileDelete: (executorId: string, tempId: string) => void;
    onCommentChange: (executorId: string, tempId: string, comment: string) => void;
    onReasonSelect: (executorId: string, reason: string) => void;
    onCustomReasonChange: (executorId: string, reason: string) => void;
    onDelete: (executorId: string) => void;
    onFileClick: (tempId: string) => void;
}

const PREDEFINED_REASONS = [
    { value: 'Late arrival', label: 'Late arrival' },
    { value: 'Missing documentation', label: 'Missing documentation' },
    { value: 'Safety violation', label: 'Safety violation' },
    { value: 'Quality issues', label: 'Quality issues' },
    { value: '0', label: 'Другая' }
];

export default function ExecutorForm({
     executor,
     index,
     showDelete,
     customReason,
     onExecutorChange,
     onFileChange,
     onFileDelete,
     onCommentChange,
     onReasonSelect,
     onCustomReasonChange,
     onDelete,
     onFileClick
 }: ExecutorFormProps) {

    const handleFilesDrop = (files: File[]) => {
        // Создаем "фейковое" событие для совместимости с onFileChange
        const fakeEvent = {
            target: {
                files: files,
            },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        // Вызываем обработчик изменения файла
        onFileChange(executor.id, fakeEvent);
    };
    return (
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Исполнитель {executor.fullName}
                </h3>
                {showDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(executor.id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <TextInput
                label="ФИО"
                value={executor.fullName}
                onChange={(value) => onExecutorChange(executor.id, 'fullName', value)}
                required
            />

            <TextInput
                label="Сумма"
                value={executor.sum}
                onChange={(value) => onExecutorChange(executor.id, 'sum', value)}
                type="number"
                required
            />

            <SelectInput
                label="Причина"
                value={executor.reason}
                options={PREDEFINED_REASONS}
                onChange={(value) => onReasonSelect(executor.id, value)}
                required={!customReason}
                placeholder="Выберите причину"
            />

            {customReason !== undefined && (
                <TextInput
                    label="Другая причина"
                    value={customReason}
                    onChange={(value) => onCustomReasonChange(executor.id, value)}
                    required
                    placeholder="Введите причину"
                />
            )}

            <TextInput
                label="Описание причины"
                value={executor.location}
                onChange={(value) => onExecutorChange(executor.id, 'comment', value)}
                required
            />

            <FileInput
                label="Файлы"
                files={executor.files}
                onFileChange={(e) => onFileChange(executor.id, e)}
                onFileDelete={(tempId) => onFileDelete(executor.id, tempId)}
                onCommentChange={(tempId, comment) => onCommentChange(executor.id, tempId, comment)}
                onFileClick={onFileClick}
                inputId={`file-upload-${executor.id}`}
                onFilesDrop={handleFilesDrop}
            />
        </div>
    );
}