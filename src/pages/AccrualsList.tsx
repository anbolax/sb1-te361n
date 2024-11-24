import React from 'react';
import { mockFines } from '../data/mockData';
import FineCard from '../components/FineCard';
import Navigation from '../components/Navigation';

export default function AccrualsList() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto px-4 pt-6 pb-20">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Штрафы
        </h1>
        
        <div className="space-y-4">
          {mockFines.map((fine) => (
            <FineCard key={fine.id} fine={fine} />
          ))}
        </div>
      </div>
      <Navigation />
    </div>
  );
}