import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StarRating from '../../components/common/StarRating';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      console.log('Fetching history...'); 
      const response = await userAPI.getHistory();
      console.log('History response:', response); 
      
      if (response.data.success) {
        setHistory(response.data.data.history);
        console.log('History loaded:', response.data.data.history); 
      } else {
        setError('Failed to load history');
      }
    } catch (error) {
      console.error('Fetch history error:', error);
      setError('Failed to load history: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const renderRating = (rating) => {
    if (!rating) {
      return (
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-gray-300 text-sm">☆</span>
            ))}
          </div>
          <span className="text-gray-400 text-sm">Not rated</span>
        </div>
      );
    }
    
    return (
      <StarRating
        rating={rating}
        onRatingChange={null}
        size="sm"
        interactive={false}
      />
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading your history..." />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="text-gray-600">Your past evening plans ({history.length} total)</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchHistory}
            className="mt-2 text-red-700 underline text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {history.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No history yet</h3>
          <p className="text-gray-600 mb-4">Complete your first evening plan to see it here</p>
          <Link 
            to="/"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create a Plan
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((historyItem) => (
            <div key={historyItem.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {historyItem.restaurant?.name || 'Unknown Restaurant'} + {historyItem.activity?.activity_title || 'Unknown Activity'}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {historyItem.restaurant?.cuisine_type || 'Cuisine'} • {historyItem.activity?.activity_type || 'Activity'}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    Total Budget: ${historyItem.total_budget || 'N/A'}
                  </p>
                  
                  {/* Rating */}
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700 block mb-1">Your Rating:</span>
                    {renderRating(historyItem.rating)}
                  </div>
                  
                  {/* Comment */}
                  {historyItem.comment && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border-l-4 border-purple-300">
                        "{historyItem.comment}"
                      </p>
                    </div>
                  )}
                  
                  {/* Status */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      historyItem.was_completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {historyItem.was_completed ? '✅ Completed' : '🔄 In Progress'}
                    </span>
                    <span>
                      {historyItem.completed_at 
                        ? `Completed: ${new Date(historyItem.completed_at).toLocaleDateString()}`
                        : `Created: ${new Date(historyItem.created_at).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/confirmation/${historyItem.schedule_hash}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    View Again
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;