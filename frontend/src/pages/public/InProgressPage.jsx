import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { planAPI, userAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const InProgressPage = () => {
  const { hash } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (hash) {
      fetchSchedule();
    }
  }, [hash]);

  const fetchSchedule = async () => {
    try {
      const response = await planAPI.getSchedule(hash);
      if (response.data.success) {
        setSchedule(response.data.data.schedule);
      }
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      alert('Please log in to add favorites');
      return;
    }

    setAddingToFavorites(true);
    try {
      await userAPI.addToFavorites(schedule.id);
      setIsFavorited(true);
      alert('Added to favorites!');
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      alert('Failed to add to favorites');
    } finally {
      setAddingToFavorites(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!isAuthenticated || rating === 0) return;

    setSubmittingFeedback(true);
    try {
      await userAPI.rateSchedule(schedule.id, { rating, comment });
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your plan..." />;

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-purple-200">Plan not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Plan In Progress</h1>
            <p className="text-purple-200">Enjoy your evening! Don't forget to rate your experience.</p>
          </div>

          {/* Current Plan Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <h2 className="text-white font-semibold mb-3">Your Evening Plan</h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🍽️</span>
                <div>
                  <p className="text-white font-medium">{schedule.restaurant.name}</p>
                  <p className="text-purple-200 text-sm">{schedule.restaurant.cuisine_type}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-white font-medium">{schedule.activity.activity_title}</p>
                  <p className="text-purple-200 text-sm">{schedule.activity.venue_name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite Button */}
          {isAuthenticated && (
            <div className="mb-6">
              <button
                onClick={handleAddToFavorites}
                disabled={addingToFavorites || isFavorited}
                className="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{isFavorited ? '❤️' : '🤍'}</span>
                <span>
                  {addingToFavorites ? 'Adding...' : isFavorited ? 'Added to Favorites' : 'Add to Favorites'}
                </span>
              </button>
            </div>
          )}

          {/* Rating Section */}
          {isAuthenticated && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <h3 className="text-white font-semibold mb-3">Rate Your Experience</h3>
              
              {/* Star Rating */}
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-colors ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-400'
                    } hover:text-yellow-300`}
                  >
                    ⭐
                  </button>
                ))}
              </div>

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience... (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90 text-gray-900 resize-none"
                rows="3"
              />

              <button
                onClick={handleSubmitRating}
                disabled={rating === 0 || submittingFeedback}
                className="w-full mt-3 bg-white text-purple-900 hover:bg-gray-100 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {submittingFeedback ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-white text-purple-900 hover:bg-gray-100 py-3 rounded-lg font-medium text-center transition-colors"
            >
              Plan Another Evening
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/dashboard/history"
                className="block w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium text-center transition-colors"
              >
                View History
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InProgressPage;