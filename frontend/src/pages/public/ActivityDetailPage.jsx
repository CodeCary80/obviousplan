import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ActivityDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Activity Details</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">Activity ID: {id}</p>
          <p className="mb-6">Detailed activity information will be displayed here.</p>
          
          <div className="space-y-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Get Directions
            </button>
            
            <div>
              <Link
                to="/"
                className="text-blue-600 hover:underline"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;