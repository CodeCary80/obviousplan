import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { planAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/button';

const ConfirmationPage = () => {
  const { hash } = useParams();
  const { isAuthenticated } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

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

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await planAPI.confirmSchedule(hash);
      // Redirect to feedback page if authenticated, or show success message
      if (isAuthenticated) {
        window.location.href = `/feedback/${hash}`;
      } else {
        alert('Plan confirmed! Have a great evening!');
      }
    } catch (error) {
      console.error('Failed to confirm:', error);
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading schedule..." />;
  if (!schedule) return <div className="text-center p-8">Schedule not found</div>;

  const totalBudget = schedule.total_estimated_budget || 
    ((schedule.restaurant?.budget_tag?.length || 1) * 25 + 
     (schedule.activity?.budget_tag?.length || 1) * 25);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Your Complete Evening Plan</h1>
            <p className="text-purple-200">Ready to go? Here's your full schedule!</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
            {/* Restaurant Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">🍽️ Dinner</h2>
              <div className="bg-white/10 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-white">{schedule.restaurant.name}</h3>
                <p className="text-purple-200">{schedule.restaurant.address}</p>
                <p className="text-purple-200">{schedule.restaurant.cuisine_type}</p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">{schedule.restaurant.people_display_text}</span>
                  <span className="text-purple-300">{schedule.restaurant.budget_display_text}</span>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">🎯 Activity</h2>
              <div className="bg-white/10 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-white">{schedule.activity.activity_title}</h3>
                {schedule.activity.venue_name && (
                  <p className="text-purple-200">At: {schedule.activity.venue_name}</p>
                )}
                {schedule.activity.address && (
                  <p className="text-purple-200">{schedule.activity.address}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-purple-300">{schedule.activity.people_display_text}</span>
                  <span className="text-purple-300">{schedule.activity.budget_display_text}</span>
                </div>
                <p className="text-purple-300 text-sm">
                  Duration: {Math.round(schedule.activity.estimated_duration_minutes / 60 * 10) / 10} hours
                </p>
              </div>
            </div>

            {/* Total Budget */}
            <div className="border-t border-white/20 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-white">Total Estimated Cost:</span>
                <span className="text-2xl font-bold text-white">${totalBudget}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleConfirm}
                loading={confirming}
                className="flex-1 bg-white text-purple-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg text-lg"
              >
                Let's Go! 🚀
              </Button>
              
              {isAuthenticated && (
                <Button
                  variant="outline"
                  className="flex-1 border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg text-lg"
                >
                  Save to Favorites ❤️
                </Button>
              )}
            </div>
            
            <div className="text-center space-x-6">
              <Link
                to={`/results/${hash}`}
                className="text-purple-200 hover:text-white underline"
              >
                ← Back to Results
              </Link>
              
              <Link
                to="/"
                className="text-purple-200 hover:text-white underline"
              >
                Start New Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;