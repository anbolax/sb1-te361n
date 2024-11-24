import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { mockFines } from '../data/mockData';
import Navigation from '../components/Navigation';

export default function FineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fine = mockFines.find(f => f.id === id);

  if (!fine) return <div>Fine not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md mx-auto px-4 pt-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          {fine.status !== 'paid' && (
            <button
              onClick={() => navigate(`/fine/edit/${fine.id}`)}
              className="flex items-center text-blue-500 hover:text-blue-600"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                ${fine.amount.toFixed(2)}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{fine.date}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              fine.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              fine.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h2>
              <p className="text-gray-900 dark:text-white">{fine.fullName}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h2>
              <p className="text-gray-900 dark:text-white">{fine.location}</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</h2>
              <p className="text-gray-900 dark:text-white">{fine.reason}</p>
            </div>

            {fine.attachments.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Attachments
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {fine.attachments.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {fine.comments.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Comments
                </h2>
                <div className="space-y-2">
                  {fine.comments.map((comment, index) => (
                    <p key={index} className="text-gray-600 dark:text-gray-300 text-sm">
                      {comment}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}