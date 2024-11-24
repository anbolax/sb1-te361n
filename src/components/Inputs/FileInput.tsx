import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { FileWithComment } from '../../types';
import FileCarousel from '../File/FileCarousel';

interface FileInputProps {
    label: string;
    files: FileWithComment[];
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFileDelete: (tempId: string) => void;
    onCommentChange: (tempId: string, comment: string) => void;
    onFileClick: (tempId: string) => void;
    inputId: string;
    onFilesDrop: (files: File[]) => void; // Новый пропс для обработки файлов после drop
}

export function FileInput({
                              label,
                              files,
                              onFileChange,
                              onFileDelete,
                              onCommentChange,
                              onFileClick,
                              inputId,
                              onFilesDrop
                          }: FileInputProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(event.dataTransfer.files);
            onFilesDrop(droppedFiles); // Передаём файлы через новый пропс
            event.dataTransfer.clearData();
        }
    };

    let divClassName = 'mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg';
    if (isDragging) {
        divClassName += ' border-blue-500';
    } else {
        divClassName += ' border-gray-300 dark:border-gray-700';
    }
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            {files.length > 0 && (
                <div className="mb-4">
                    <FileCarousel
                        files={files}
                        onFileDelete={onFileDelete}
                        onCommentChange={onCommentChange}
                        onFileClick={onFileClick}
                    />
                </div>
            )}

            <div
                className={divClassName}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                            htmlFor={inputId}
                            className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                            <span>Загрузите файлы</span>
                            <input
                                id={inputId}
                                name={inputId}
                                type="file"
                                className="sr-only"
                                multiple
                                onChange={onFileChange}
                            />
                        </label>
                        <p className="pl-1">или перетащите в это окно</p>
                    </div>
                   {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF, MP4, XLS, XLSX up to 10MB
                    </p>*/}
                </div>
            </div>
        </div>
    );
}
