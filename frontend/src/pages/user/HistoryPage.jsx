import React from 'react';

const HistoryPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="text-gray-600">Your past evening plans</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No history yet</h3>
        <p className="text-gray-600 mb-4">Create your first evening plan to see it here</p>
      </div>
    </div>
  );
};

export default HistoryPage;