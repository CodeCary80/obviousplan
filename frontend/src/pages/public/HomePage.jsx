import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../../hooks/useGeolocation';
import { planAPI } from '../../services/api';
import Button from '../../components/common/button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Icon components for visual selectors
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
        p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2
        ${selected === level 
          ? 'border-purple-500 bg-purple-50 text-purple-700' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
      `}
    >
      <span className="text-2xl">{icons[level]}</span>
      <span className="text-sm font-medium">{level}</span>
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
        p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2
        ${selected === level 
          ? 'border-purple-500 bg-purple-50 text-purple-700' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
      `}
    >
      <span className="text-2xl">{icons[level]}</span>
      <span className="text-xs font-medium">{labels[level]}</span>
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
        p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2
        ${selected === type 
          ? 'border-purple-500 bg-purple-50 text-purple-700' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
      `}
    >
      <span className="text-2xl">{icons[type]}</span>
      <span className="text-xs font-medium">{type}</span>
    </button>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const { location, error: locationError, loading: locationLoading, getCurrentLocation } = useGeolocation();
  
  const [formData, setFormData] = useState({
    energy_level: '',
    budget_preference: '',
    company_type: '',
    location_shared: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocationToggle = (checked) => {
    setFormData(prev => ({ ...prev, location_shared: checked }));
    
    if (checked && !location && !locationLoading) {
      getCurrentLocation();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
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

      // Add location data if available and user opted in
      if (formData.location_shared && location) {
        requestData.user_latitude = location.latitude;
        requestData.user_longitude = location.longitude;
      }

      const response = await planAPI.generatePlan(requestData);
      
      if (response.data.success) {
        const scheduleHash = response.data.data.schedule.hash;
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What's the plan tonight?
            </h1>
            <p className="text-purple-200 text-lg">
              Tell us your vibe and we'll create the perfect evening for you
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Energy Level */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                What's your energy level?
              </h2>
              <div className="grid grid-cols-3 gap-4">
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                What's your budget?
              </h2>
              <div className="grid grid-cols-5 gap-2">
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                How many people are expected?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="location-share"
                  checked={formData.location_shared}
                  onChange={(e) => handleLocationToggle(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="location-share" className="text-white font-medium">
                  Use my current location
                </label>
              </div>
              
              {formData.location_shared && (
                <div className="mt-4">
                  {locationLoading && (
                    <div className="flex items-center space-x-2 text-purple-200">
                      <div className="animate-spin h-4 w-4 border-2 border-purple-300 border-t-transparent rounded-full"></div>
                      <span className="text-sm">Getting your location...</span>
                    </div>
                  )}
                  
                  {location && (
                    <div className="text-green-300 text-sm">
                      ✓ Location found! We'll suggest nearby places.
                    </div>
                  )}
                  
                  {locationError && (
                    <div className="text-yellow-300 text-sm">
                      ⚠️ {locationError}
                      <br />
                      <span className="text-purple-200">
                        No worries! We'll still find great places for you.
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {!formData.location_shared && (
                <p className="text-purple-200 text-sm mt-2">
                  For restaurant suggestions nearest to you, please enable location sharing.
                </p>
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
    className="bg-white text-purple-900 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? 'Creating your plan...' : "Let's see!"}
  </button>
</div>

          </form>

          {/* Loading State */}
          {loading && (
            <div className="mt-8">
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