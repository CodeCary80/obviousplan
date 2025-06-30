import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { planAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
      console.error('Fetch error:', error);
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleShuffleRestaurant = async () => {
    console.log('Current schedule object:', schedule);
    console.log('Hash from schedule:', schedule?.hash);
    
    if (!schedule?.hash) {
      console.error('No hash available in schedule');
      alert('No schedule available to shuffle');
      return;
    }
    
    setShuffling(prev => ({ ...prev, restaurant: true }));
    try {
      const response = await planAPI.shuffleRestaurant(schedule.hash);
      console.log('Shuffle API response:', response);
      
      if (response.data.success) {
        setSchedule(prev => ({
          ...prev,
          restaurant: response.data.data.restaurant
        }));
        console.log('Restaurant updated successfully');
      } else {
        alert(response.data.message || 'No alternative restaurant found');
      }
    } catch (error) {
      console.error('Shuffle failed:', error);
      alert('Failed to shuffle restaurant. Please try again.');
    } finally {
      setShuffling(prev => ({ ...prev, restaurant: false }));
    }
  };

  const handleShuffleActivity = async () => {
    console.log('Shuffling activity with hash:', schedule?.hash);
    
    if (!schedule?.hash) {
      console.error('No hash available for activity shuffle');
      alert('No schedule available to shuffle');
      return;
    }
    
    setShuffling(prev => ({ ...prev, activity: true }));
    try {
      const response = await planAPI.shuffleActivity(schedule.hash);
      console.log('Activity shuffle API response:', response);
      
      if (response.data.success) {
        setSchedule(prev => ({
          ...prev,
          activity: response.data.data.activity
        }));
        console.log('Activity updated successfully');
      } else {
        alert(response.data.message || 'No alternative activity found');
      }
    } catch (error) {
      console.error('Activity shuffle failed:', error);
      alert('Failed to shuffle activity. Please try again.');
    } finally {
      setShuffling(prev => ({ ...prev, activity: false }));
    }
  };

  const handleShuffleWholePlan = () => {
    navigate('/');
  };

  if (loading) return <LoadingSpinner message="Loading your plan..." />;
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Oops!</h2>
        <p className="text-purple-200 mb-4">{error}</p>
        <Link to="/" className="bg-white text-purple-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Start Over
        </Link>
      </div>
    </div>
  );
  
  if (!schedule) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <p className="text-purple-200">No schedule found</p>
      </div>
    </div>
  );

  {/* Location Messages */}
{!schedule.location_based && (
  <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-6">
    <div className="flex items-center space-x-3">
      <span className="text-2xl">📍</span>
      <div>
        <h3 className="text-white font-semibold text-sm">Enable Location for Better Suggestions</h3>
        <p className="text-blue-200 text-xs">
          Share your location on the home page to get nearby restaurants and activities!
        </p>
      </div>
    </div>
  </div>
)}

{schedule.location_based && (
  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6">
    <div className="flex items-center space-x-3">
      <span className="text-2xl">✅</span>
      <div>
        <h3 className="text-white font-semibold text-sm">Location-Based Suggestions</h3>
        <p className="text-green-200 text-xs">
          These recommendations are near your current location!
        </p>
      </div>
    </div>
  </div>
)}
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Back Button */}
          <div className="mb-4">
            <Link 
              to="/" 
              className="flex items-center text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">new plan</h1>
          </div>

          {/* Restaurant Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white text-sm font-medium">Restaurant</span>
              <button
                onClick={handleShuffleRestaurant}
                disabled={shuffling.restaurant}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50"
              >
                {shuffling.restaurant ? 'Shuffling...' : 'Shuffle Restaurant'}
              </button>
            </div>
            
            {/* Restaurant Image Placeholder */}
            <div className="w-full h-32 bg-gray-300 rounded-lg mb-3">
              <img 
                src={schedule.restaurant.curated_image_url ? `http://localhost:8000${schedule.restaurant.curated_image_url}` : "/api/placeholder/300/200"}
                alt={schedule.restaurant.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dy='.3em' fill='%236b7280'%3ERestaurant Image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <div className="space-y-1 text-white">
              <h3 className="font-semibold">{schedule.restaurant.name}</h3>
              <p className="text-purple-200 text-sm">{schedule.restaurant.cuisine_type}</p>
              <div className="flex justify-between items-center text-xs text-purple-300">
                <span>{schedule.restaurant.budget_display_text}</span>
                <span>{schedule.restaurant.people_display_text}</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/restaurant/${schedule.restaurant.id}?return=/results/${hash}`)}
              className="w-full mt-3 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View Details
            </button>
          </div>

          {/* Activity Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white text-sm font-medium">Activity</span>
              <button
                onClick={handleShuffleActivity}
                disabled={shuffling.activity}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50"
              >
                {shuffling.activity ? 'Shuffling...' : 'Shuffle Activity'}
              </button>
            </div>
            
            {/* Activity Image Placeholder */}
            <div className="w-full h-32 bg-gray-300 rounded-lg mb-3">
            <img 
                src={schedule.activity.curated_image_url ? `http://localhost:8000${schedule.activity.curated_image_url}` : "/api/placeholder/300/200"}
                alt={schedule.activity.name}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dy='.3em' fill='%236b7280'%3Activity Image%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>

            <div className="space-y-1 text-white">
              <h3 className="font-semibold">{schedule.activity.activity_title}</h3>
              <p className="text-purple-200 text-sm">{schedule.activity.venue_name}</p>
              <div className="flex justify-between items-center text-xs text-purple-300">
                <span>{schedule.activity.budget_display_text}</span>
                <span>{schedule.activity.people_display_text}</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate(`/activity/${schedule.activity.id}?return=/results/${hash}`)}
              className="w-full mt-3 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View Details
            </button>
          </div>

          {/* Suggestion Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <h3 className="text-white font-medium mb-2">💡 Suggestion</h3>
            <p className="text-purple-200 text-sm">{schedule.tip.tip_text}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleShuffleWholePlan}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Shuffle the whole plan
            </button>
            
            <button
              onClick={() => navigate(`/confirmation/${hash}`)}
              className="w-full bg-white text-purple-900 hover:bg-gray-100 py-3 rounded-lg font-medium transition-colors"
            >
              View Full Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;