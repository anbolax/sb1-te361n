import React from 'react';
import { Settings, Bell, Plus, Upload, ChevronRight, FilePlus  } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDetailPage = location.pathname.includes('/fine/');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-md mx-auto px-4 py-2 flex justify-between items-center">
        <button
          onClick={() => navigate('/settings')}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
        >
          <Settings className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
        >
          <Bell className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => navigate(isDetailPage ? '#upload' : '/new')}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
        >
          {isDetailPage ? <Upload className="w-6 h-6" /> : <FilePlus className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}