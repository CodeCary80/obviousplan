import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { planAPI, userAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StarRating from '../../components/common/StarRating';

const ConfirmationPage = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  
  // Progress states
  const [planStarted, setPlanStarted] = useState(false);
  const [restaurantCompleted, setRestaurantCompleted] = useState(false);
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Favorites and rating
  const [isFavorited, setIsFavorited] = useState(false);
  const [addingToFavorites, setAddingToFavorites] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // NEW: For hover effects
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (hash) {
      fetchSchedule();
      loadProgressState();
    }
  }, [hash]);

  useEffect(() => {
    if (planStarted && restaurantCompleted && activityCompleted) {
      localStorage.removeItem(`plan_progress_${hash}`);
      localStorage.removeItem('current_plan_progress');
    }
  }, [restaurantCompleted, activityCompleted, planStarted, hash]);

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

  const loadProgressState = () => {
    const savedProgress = localStorage.getItem(`plan_progress_${hash}`);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setPlanStarted(progress.planStarted || false);
        setRestaurantCompleted(progress.restaurantCompleted || false);
        setActivityCompleted(progress.activityCompleted || false);
        setIsFavorited(progress.isFavorited || false);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  };

  const saveProgressState = (updates) => {
    const currentProgress = {
      planStarted,
      restaurantCompleted,
      activityCompleted,
      isFavorited,
      timestamp: new Date().toISOString(),
      ...updates
    };
    localStorage.setItem(`plan_progress_${hash}`, JSON.stringify(currentProgress));
  };

  const handleStartPlan = async () => {
    setConfirming(true);
    try {
      await planAPI.confirmSchedule(hash);
      setPlanStarted(true);
      setShowSuccessMessage(true);
      
      saveProgressState({ planStarted: true });
      
      const progressData = {
        hash: hash,
        restaurant: schedule.restaurant.name,
        activity: schedule.activity.activity_title,
        timestamp: new Date().toISOString(),
        confirmed: true
      };
      localStorage.setItem('current_plan_progress', JSON.stringify(progressData));
      
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
    } catch (error) {
      console.error('Failed to confirm:', error);
    } finally {
      setConfirming(false);
    }
  };

  const handleRestaurantComplete = (completed) => {
    setRestaurantCompleted(completed);
    saveProgressState({ restaurantCompleted: completed });
  };

  const handleActivityComplete = (completed) => {
    setActivityCompleted(completed);
    saveProgressState({ activityCompleted: completed });
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated) {
      return; 
    }

    setAddingToFavorites(true);
    try {
      await userAPI.addToFavorites(schedule.id || hash);
      setIsFavorited(true);
      saveProgressState({ isFavorited: true });
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    } finally {
      setAddingToFavorites(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!isAuthenticated || rating === 0) return;
  
    setSubmittingFeedback(true);
    try {
      console.log('Debug info:', { 
        scheduleId: schedule?.id, 
        hash: hash, 
        rating: rating, 
        comment: comment,
        authToken: localStorage.getItem('auth_token') ? 'exists' : 'missing'
      });
      
      const response = await userAPI.rateSchedule(hash, { rating, comment });
      console.log('Success response:', response);
      
      const ratingStars = '⭐'.repeat(rating);
      setRating(0);
      setComment('');
      alert(`Thank you for your ${ratingStars} rating!`);
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Status:', error.response?.status);
      alert('Debug info in console - check F12');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleBackToHome = () => {
    // Clear all progress
    localStorage.removeItem(`plan_progress_${hash}`);
    localStorage.removeItem('current_plan_progress');
    navigate('/');
  };

  if (loading) return <LoadingSpinner message="Loading schedule..." />;
  if (!schedule) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <p className="text-purple-200">Schedule not found</p>
      </div>
    </div>
  );

  const totalBudget = schedule.total_estimated_budget || 
    ((schedule.restaurant?.budget_tag?.length || 1) * 25 + 
     (schedule.activity?.budget_tag?.length || 1) * 25);

  const bothCompleted = restaurantCompleted && activityCompleted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <div className="mb-4">
            <Link 
              to={`/results/${hash}`}
              className="flex items-center text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Results
            </Link>
          </div>

          {/* Success Message */}
          {showSuccessMessage && !bothCompleted && (
            <div className="mb-6 bg-green-500/30 border-2 border-green-400 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <h3 className="text-white font-bold text-lg">Plan Started Successfully!</h3>
                  <p className="text-green-100 text-sm">
                    Check off each step as you complete them below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              {!planStarted ? 'Your Complete Evening Plan' : 
               bothCompleted ? 'Plan Completed!' : 'Plan In Progress'}
            </h1>
            <p className="text-purple-200">
              {!planStarted ? "Ready to go? Here's your full schedule!" :
               bothCompleted ? 'Congratulations on a great evening!' : 
               'Check off items as you complete them'}
            </p>
          </div>

          {/* Completion Celebration */}
          {bothCompleted && (
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 mb-6 text-center">
              <div className="text-4xl mb-4">🎊🎉🎊</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Awesome Evening!
              </h2>
              <p className="text-green-100 mb-4">
                Hope you had a wonderful time at {schedule.restaurant.name} and {schedule.activity.activity_title}!
              </p>
              
              {/* Rating Section for Completed Plan */}
              {isAuthenticated && (
                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <h3 className="text-white font-semibold mb-4 text-center">Rate Your Experience</h3>
                  
                  {/* Star Rating */}
                  <StarRating
                    rating={rating}
                    onRatingChange={setRating}
                    size="lg"
                    interactive={true}
                  />

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/90 text-gray-900 resize-none text-sm mt-4"
                    rows="3"
                  />

                <button
                      onClick={handleSubmitRating}
                      disabled={rating === 0 || submittingFeedback}
                      className="w-full mt-4 bg-white text-green-600 hover:bg-gray-100 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ color: '#059669' }}
                    >
                      {submittingFeedback ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full mr-2"></div>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Rating'
                      )}
                  </button>
                </div>
              )}
              
              <button
                onClick={handleBackToHome}
                className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
                style={{ color: '#059669' }}
              >
                Plan Another Evening
              </button>
            </div>
          )}

          {/* Plan Details */}
          {!bothCompleted && (
            <div className="space-y-4 mb-6">
              {/* Restaurant Section */}
              <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-500 ${
                restaurantCompleted ? 'opacity-60 bg-green-500/20' : 'opacity-100 ring-2 ring-white/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    🍽️ Dinner
                  </h2>
                  {planStarted && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={restaurantCompleted}
                        onChange={(e) => handleRestaurantComplete(e.target.checked)}
                        className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <span className="text-white text-sm font-medium">
                        {restaurantCompleted ? 'Completed!' : 'Mark as done'}
                      </span>
                    </label>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    {restaurantCompleted && <span className="text-green-400 text-xl">✅</span>}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{schedule.restaurant.name}</h3>
                      <p className="text-purple-200 text-sm">{schedule.restaurant.address}</p>
                      <p className="text-purple-200 text-sm">{schedule.restaurant.cuisine_type}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-300">{schedule.restaurant.people_display_text}</span>
                    <span className="text-purple-300">{schedule.restaurant.budget_display_text}</span>
                  </div>
                  
                  {planStarted && !restaurantCompleted && (
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(schedule.restaurant.address)}`, '_blank')}
                      className="w-full mt-2 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Get Directions
                    </button>
                  )}
                </div>
              </div>

              {/* Activity Section */}
              <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-500 ${
                activityCompleted ? 'opacity-60 bg-green-500/20' : 'opacity-100 ring-2 ring-white/20'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    🎯 Activity
                  </h2>
                  {planStarted && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activityCompleted}
                        onChange={(e) => handleActivityComplete(e.target.checked)}
                        className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <span className="text-white text-sm font-medium">
                        {activityCompleted ? 'Completed!' : 'Mark as done'}
                      </span>
                    </label>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    {activityCompleted && <span className="text-green-400 text-xl">✅</span>}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{schedule.activity.activity_title}</h3>
                      {schedule.activity.venue_name && (
                        <p className="text-purple-200 text-sm">At: {schedule.activity.venue_name}</p>
                      )}
                      {schedule.activity.address && (
                        <p className="text-purple-200 text-sm">{schedule.activity.address}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-300">{schedule.activity.people_display_text}</span>
                    <span className="text-purple-300">{schedule.activity.budget_display_text}</span>
                  </div>
                  <p className="text-purple-300 text-xs">
                    Duration: {Math.round(schedule.activity.estimated_duration_minutes / 60 * 10) / 10} hours
                  </p>
                  
                  {planStarted && !activityCompleted && schedule.activity.address && (
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(schedule.activity.address)}`, '_blank')}
                      className="w-full mt-2 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Get Directions
                    </button>
                  )}
                </div>
              </div>

              {/* Total Budget */}
              {!planStarted && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total Estimated Cost:</span>
                    <span className="text-xl font-bold text-white">${totalBudget}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {!bothCompleted && (
            <div className="space-y-4">
              {!planStarted ? (
                /* Initial Start Button */
                <button
                  onClick={handleStartPlan}
                  disabled={confirming}
                  className="w-full bg-white text-purple-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: '#7c3aed' }}
                >
                  {confirming ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2">⟳</span>
                      Starting Plan...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Let's Go! 
                      <span className="ml-2">🚀</span>
                    </span>
                  )}
                </button>
              ) : (
                /* In-Progress Actions */
                <div className="space-y-3">
                  {isAuthenticated && !isFavorited && (
                    <button
                      onClick={handleAddToFavorites}
                      disabled={addingToFavorites}
                      className="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <span>🤍</span>
                      <span>{addingToFavorites ? 'Adding...' : 'Add to Favorites'}</span>
                    </button>
                  )}
                  
                  {isFavorited && (
                    <div className="text-center">
                      <span className="text-green-300 text-sm">❤️ Added to favorites</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-center space-x-6">
                <Link
                  to="/"
                  className="text-purple-200 hover:text-white underline text-sm"
                >
                  Plan Another Evening
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;