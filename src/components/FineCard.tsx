import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Fine } from '../types';
import { useNavigate } from 'react-router-dom';

interface FineCardProps {
  fine: Fine;
}

export default function FineCard({ fine }: FineCardProps) {
  const navigate = useNavigate();

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div
      onClick={() => navigate(`/fine/${fine.id}`)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{fine.date}</p>
          <p className="font-semibold text-gray-900 dark:text-white">${fine.amount.toFixed(2)}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[fine.status]}`}>
          {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">{fine.location}</p>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}