import React from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  comment: string;
  onDelete: () => void;
  onCommentChange: (comment: string) => void;
  onClick: () => void;
}

export default function FilePreview({ file, comment, onDelete, onCommentChange, onClick }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');
  const preview = isImage ? URL.createObjectURL(file) : null;

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="relative group">
      <div 
        onClick={onClick}
        className="w-full h-32 rounded-lg overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
      >
        {isImage ? (
          <img
            src={preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      
      <button
        onClick={onDelete}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
      
      <input
        type="text"
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Add a comment..."
        className="mt-2 w-full text-sm px-2 py-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>
  );
}