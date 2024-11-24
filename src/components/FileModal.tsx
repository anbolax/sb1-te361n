import React, { useRef, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface FileModalProps {
  file: File;
  comment: string;
  onClose: () => void;
  onCommentChange: (comment: string) => void;
  onDelete: () => void;
}

export default function FileModal({ file, comment, onClose, onCommentChange, onDelete }: FileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const isImage = file.type.startsWith('image/');
  const preview = isImage ? URL.createObjectURL(file) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview, onClose]);

  const truncateFilename = (filename: string, maxLength: number = 30) => {
    if (filename.length <= maxLength) return filename;
    
    const extension = filename.split('.').pop();
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - 3 - (extension?.length || 0));
    
    return `${truncatedName}...${extension ? `.${extension}` : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 
            className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-4"
            title={file.name}
          >
            {truncateFilename(file.name)}
          </h3>
          <button 
            onClick={onClose}
            className="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            {isImage ? (
              <img
                src={preview}
                alt={file.name}
                className="max-h-[60vh] mx-auto object-contain rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Download className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => onCommentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Add a comment about this file..."
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={onDelete}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                type="button"
              >
                Delete
              </button>
              <div className="space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 font-medium transition-colors"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  type="button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}