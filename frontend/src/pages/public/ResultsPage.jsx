import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { planAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/button';

const ResultsPage = () => {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shuffling, setShuffling] = useState({ restaurant: false, activity: false });

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
      } else {
        setError('Schedule not found');
      }
    } catch (error) {
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleShuffleRestaurant = async () => {
    setShuffling(prev => ({ ...prev, restaurant: true }));
    try {
      const response = await planAPI.shuffleRestaurant(hash);
      if (response.data.success) {
        setSchedule(prev => ({
          ...prev,
          restaurant: response.data.data.restaurant
        }));
      }
    } catch (error) {
      console.error('Shuffle failed:', error);
    } finally {
      setShuffling(prev => ({ ...prev, restaurant: false }));
    }
  };

  const handleShuffleActivity = async () => {
    setShuffling(prev => ({ ...prev, activity: true }));
    try {
      const response = await planAPI.shuffleActivity(hash);
      if (response.data.success) {
        setSchedule(prev => ({
          ...prev,
          activity: response.data.data.activity
        }));
      }
    } catch (error) {
      console.error('Shuffle failed:', error);
    } finally {
      setShuffling(prev => ({ ...prev, activity: false }));
    }
  };

  if (loading) return <LoadingSpinner message="Loading your plan..." />;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!schedule) return <div className="text-center p-8">No schedule found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Your Perfect Evening</h1>
            <p className="text-purple-200">Here's what we've planned for you!</p>
          </div>

          {/* Schedule Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Restaurant Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-white">🍽️ Restaurant</h2>
                <Button
                  onClick={handleShuffleRestaurant}
                  loading={shuffling.restaurant}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Shuffle
                </Button>
              </div>
              
              <div className="space-y-2 text-white">
                <h3 className="font-semibold text-lg">{schedule.restaurant.name}</h3>
                <p className="text-purple-200">{schedule.restaurant.cuisine_type}</p>
                <p className="text-purple-200">{schedule.restaurant.budget_display_text}</p>
                <p className="text-sm text-purple-300">{schedule.restaurant.people_display_text}</p>
              </div>
              
              <div className="mt-4">
                <Link
                  to={`/restaurant/${schedule.restaurant.id}`}
                  className="inline-block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>

            {/* Activity Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-white">🎯 Activity</h2>
                <Button
                  onClick={handleShuffleActivity}
                  loading={shuffling.activity}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Shuffle
                </Button>
              </div>
              
              <div className="space-y-2 text-white">
                <h3 className="font-semibold text-lg">{schedule.activity.activity_title}</h3>
                <p className="text-purple-200">{schedule.activity.venue_name}</p>
                <p className="text-purple-200">{schedule.activity.budget_display_text}</p>
                <p className="text-sm text-purple-300">{schedule.activity.people_display_text}</p>
              </div>
              
              <div className="mt-4">
                <Link
                  to={`/activity/${schedule.activity.id}`}
                  className="inline-block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Tip Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">💡 Pro Tip</h2>
            <p className="text-purple-200">{schedule.tip.tip_text}</p>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div>
              <Link
                to={`/confirmation/${hash}`}
                className="inline-block bg-white text-purple-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105"
              >
                View Full Schedule
              </Link>
            </div>
            
            <div className="space-x-4">
              <Link
                to="/"
                className="inline-block text-purple-200 hover:text-white underline"
              >
                Start Over
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;