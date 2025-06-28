import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../../hooks/useGeolocation';
import { planAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Responsive Icon Components
const EnergyIcon = ({ level, selected, onClick }) => {
  const icons = {
    Low: '🔋',
    Medium: '🔋🔋🔋',
    High: '🔋🔋🔋🔋🔋'
  };

  return (
    <button
      type="button"
      onClick={() => onClick(level)}
      className={`
        p-3 sm:p-4 rounded-xl border-3 transition-all duration-300 
        flex flex-col items-center justify-center space-y-1 sm:space-y-2 
        transform hover:scale-105 active:scale-95
        min-h-[80px] sm:min-h-[100px] w-full
        ${selected === level 
          ? 'border-green-400 bg-green-500 text-white shadow-lg shadow-green-500/50 ring-2 sm:ring-4 ring-green-300/50' 
          : 'border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white'
        }
      `}
    >
      <span className="text-lg sm:text-2xl filter drop-shadow-lg">{icons[level]}</span>
      <span className={`text-xs sm:text-sm font-bold leading-tight text-center ${selected === level ? 'text-white' : 'text-purple-100'}`}>
        {level}
      </span>
      {selected === level && (
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
      )}
    </button>
  );
};

const BudgetIcon = ({ level, selected, onClick }) => {
  const icons = {
    '$': '💰',
    '$$': '💰💰',
    '$$$': '💰💰💰',
    '$$$$': '💰💰💰💰',
    '$$$$$': '💰💰💰💰💰'
  };

  const labels = {
    '$': '$10-20',
    '$$': '$25-45',
    '$$$': '$45-75',
    '$$$$': '$75-125',
    '$$$$$': '$125+'
  };

  return (
    <button
      type="button"
      onClick={() => onClick(level)}
      className={`
        p-2 sm:p-4 rounded-xl border-3 transition-all duration-300 
        flex flex-col items-center justify-center space-y-1 sm:space-y-2 
        transform hover:scale-105 active:scale-95
        min-h-[70px] sm:min-h-[100px] w-full
        ${selected === level 
          ? 'border-yellow-400 bg-yellow-500 text-white shadow-lg shadow-yellow-500/50 ring-2 sm:ring-4 ring-yellow-300/50' 
          : 'border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white'
        }
      `}
    >
      <span className="text-sm sm:text-2xl filter drop-shadow-lg leading-none">{icons[level]}</span>
      <span className={`text-[10px] sm:text-xs font-bold leading-tight text-center ${selected === level ? 'text-white' : 'text-purple-100'}`}>
        {labels[level]}
      </span>
      {selected === level && (
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
      )}
    </button>
  );
};

const PeopleIcon = ({ type, selected, onClick }) => {
  const icons = {
    Solo: '🧑',
    Date: '👫',
    'Small Group': '👥',
    'Large Group': '👥👥'
  };

  return (
    <button
      type="button"
      onClick={() => onClick(type)}
      className={`
        p-3 sm:p-4 rounded-xl border-3 transition-all duration-300 
        flex flex-col items-center justify-center space-y-1 sm:space-y-2 
        transform hover:scale-105 active:scale-95
        min-h-[80px] sm:min-h-[100px] w-full
        ${selected === type 
          ? 'border-blue-400 bg-blue-500 text-white shadow-lg shadow-blue-500/50 ring-2 sm:ring-4 ring-blue-300/50' 
          : 'border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white'
        }
      `}
    >
      <span className="text-lg sm:text-2xl filter drop-shadow-lg">{icons[type]}</span>
      <span className={`text-[10px] sm:text-xs font-bold leading-tight text-center px-1 ${selected === type ? 'text-white' : 'text-purple-100'}`}>
        {type}
      </span>
      {selected === type && (
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
      )}
    </button>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { location, error: locationError, loading: locationLoading, getCurrentLocation } = useGeolocation();
  
  const [currentProgress, setCurrentProgress] = useState(null);
  
  const [formData, setFormData] = useState({
    energy_level: '',
    budget_preference: '',
    company_type: '',
    location_shared: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkCurrentProgress();
  }, []);

  const checkCurrentProgress = () => {
    const progressData = localStorage.getItem('current_plan_progress');
    if (progressData) {
      try {
        const progress = JSON.parse(progressData);
        const progressTime = new Date(progress.timestamp);
        const now = new Date();
        const hoursDiff = (now - progressTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setCurrentProgress(progress);
        } else {
          localStorage.removeItem('current_plan_progress');
        }
      } catch (error) {
        localStorage.removeItem('current_plan_progress');
      }
    }
  };

  const handleContinueProgress = () => {
    if (currentProgress) {
      navigate(`/confirmation/${currentProgress.hash}`);
    }
  };

  const handleDismissProgress = () => {
    localStorage.removeItem('current_plan_progress');
    setCurrentProgress(null);
  };

  const handleLocationToggle = (checked) => {
    setFormData(prev => ({ ...prev, location_shared: checked }));
    
    if (checked && !location && !locationLoading) {
      getCurrentLocation();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.energy_level || !formData.budget_preference || !formData.company_type) {
      setError('Please select options for all questions.');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        energy_level: formData.energy_level,
        budget_preference: formData.budget_preference,
        company_type: formData.company_type,
        location_shared: formData.location_shared,
      };

      if (formData.location_shared && location) {
        requestData.user_latitude = location.latitude;
        requestData.user_longitude = location.longitude;
      }

      const response = await planAPI.generatePlan(requestData);
      
      if (response.data.success) {
        const scheduleHash = response.data.data.schedule.hash;
        
        const progressData = {
          hash: scheduleHash,
          restaurant: response.data.data.schedule.restaurant.name,
          activity: response.data.data.schedule.activity.activity_title,
          timestamp: new Date().toISOString(),
          confirmed: false
        };
        localStorage.setItem('current_plan_progress', JSON.stringify(progressData));
        
        navigate(`/results/${scheduleHash}`);
      } else {
        setError(response.data.message || 'Failed to generate plan');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.energy_level && formData.budget_preference && formData.company_type;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <div className="max-w-lg mx-auto">
          {/* Progress Alert */}
          {currentProgress && (
            <div className="mb-6 sm:mb-8 bg-orange-500/20 border border-orange-500/50 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl sm:text-2xl">🎯</span>
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base">Plan in Progress</h3>
                    <p className="text-orange-200 text-xs sm:text-sm">
                      {currentProgress.restaurant} → {currentProgress.activity}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismissProgress}
                  className="text-orange-200 hover:text-white text-lg sm:text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleContinueProgress}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex-1"
                >
                  Continue Plan
                </button>
                <button
                  onClick={handleDismissProgress}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium flex-1"
                >
                  Start New Plan
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              What's the plan tonight?
            </h1>
            <p className="text-purple-200 text-base sm:text-lg px-4">
              Tell us your vibe and we'll create the perfect evening for you
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Energy Level */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                What's your energy level?
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {['Low', 'Medium', 'High'].map((level) => (
                  <EnergyIcon
                    key={level}
                    level={level}
                    selected={formData.energy_level}
                    onClick={(value) => setFormData(prev => ({ ...prev, energy_level: value }))}
                  />
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                What's your budget?
              </h2>
              <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {['$', '$$', '$$$', '$$$$', '$$$$$'].map((level) => (
                  <BudgetIcon
                    key={level}
                    level={level}
                    selected={formData.budget_preference}
                    onClick={(value) => setFormData(prev => ({ ...prev, budget_preference: value }))}
                  />
                ))}
              </div>
            </div>

            {/* Company */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                How many people are expected?
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {['Solo', 'Date', 'Small Group', 'Large Group'].map((type) => (
                  <PeopleIcon
                    key={type}
                    type={type}
                    selected={formData.company_type}
                    onClick={(value) => setFormData(prev => ({ ...prev, company_type: value }))}
                  />
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="location-share"
                  checked={formData.location_shared}
                  onChange={(e) => handleLocationToggle(e.target.checked)}
                  className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="location-share" className="text-white font-medium text-sm sm:text-base cursor-pointer">
                    Use my current location
                  </label>
                  <p className="text-purple-200 text-xs sm:text-sm mt-1">
                    For restaurant suggestions nearest to you
                  </p>
                </div>
              </div>
              
              {formData.location_shared && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  {locationLoading && (
                    <div className="flex items-center space-x-2 text-purple-200">
                      <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-purple-300 border-t-transparent rounded-full"></div>
                      <span className="text-xs sm:text-sm">Getting your location...</span>
                    </div>
                  )}
                  
                  {location && (
                    <div className="text-green-300 text-xs sm:text-sm flex items-center space-x-2">
                      <span>✓</span>
                      <span>Location found! We'll suggest nearby places.</span>
                    </div>
                  )}
                  
                  {locationError && (
                    <div className="text-yellow-300 text-xs sm:text-sm">
                      <div className="flex items-start space-x-2">
                        <span>⚠️</span>
                        <div>
                          <div>{locationError}</div>
                          <div className="text-purple-200 mt-1">
                            No worries! We'll still find great places for you.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full sm:w-auto bg-white text-purple-900 hover:bg-gray-100 font-semibold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                style={{ color: '#7c3aed' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-purple-600 border-t-transparent rounded-full mr-2"></div>
                    Creating your plan...
                  </span>
                ) : (
                  "Let's see!"
                )}
              </button>
            </div>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 sm:mt-8">
              <LoadingSpinner 
                size="lg" 
                message="Creating your perfect evening plan..." 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;