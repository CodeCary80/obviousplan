import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

const ActivityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnPath = searchParams.get('return') || '/';
  
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchActivity();
    checkAdminStatus();
  }, [id]);

  const checkAdminStatus = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(token && user.role === 'admin');
  };

  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/activities/${id}`, {  // Remove http://localhost:8000
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        setActivity(data.data.activity);
      } else {
        setError('Activity not found');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/activities/${id}/upload-image`, {  // Remove http://localhost:8000
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
      const data = await response.json();
      
      if (data.success) {
        setActivity(prev => ({
          ...prev,
          curated_image_url: data.data.image_url
        }));
        alert('Image uploaded successfully!');
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };
  
  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/activities/${id}/delete-image`, {  // Remove http://localhost:8000
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      
      if (data.success) {
        setActivity(prev => ({
          ...prev,
          curated_image_url: null
        }));
        alert('Image deleted successfully!');
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-purple-200 mb-4">{error}</p>
        <button onClick={() => navigate(returnPath)} className="bg-white text-purple-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => navigate(returnPath)}
              className="flex items-center text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Results
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Activity Image */}
            <div className="relative h-64 bg-gray-300">
            <img 
              src={activity?.curated_image_url || "/api/placeholder/600/400"} 
              alt={activity?.activity_title || "Activity"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' dy='.3em' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";
              }}
            />
              
              {/* Admin Image Controls - Shows only if user is admin */}
              {isAdmin && (
                <div className="absolute top-4 right-4 space-x-2">
                  <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm cursor-pointer">
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  
                  {activity?.curated_image_url && (
                    <button
                      onClick={handleDeleteImage}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2">{activity?.activity_title}</h1>
              <p className="text-gray-600 text-lg mb-4">{activity?.activity_type}</p>
              
              {activity?.venue_name && (
                <p className="text-gray-700 font-medium mb-2">📍 {activity.venue_name}</p>
              )}
              
              {activity?.description && (
                <p className="text-gray-700 mb-6">{activity.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Budget</h3>
                  <p className="text-gray-600">{activity?.budget_display_text}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Perfect For</h3>
                  <p className="text-gray-600">{activity?.people_display_text}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Energy Level</h3>
                  <p className="text-gray-600">{activity?.energy_tag}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Duration</h3>
                  <p className="text-gray-600">
                    {activity?.estimated_duration_minutes 
                      ? `${Math.round(activity.estimated_duration_minutes / 60)} hours`
                      : 'Varies'
                    }
                  </p>
                </div>
              </div>

              {activity?.indoor_outdoor_status && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Setting</h3>
                  <p className="text-gray-600">{activity.indoor_outdoor_status}</p>
                </div>
              )}

              {activity?.required_materials && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-1">What to Bring</h3>
                  <p className="text-gray-600">{activity.required_materials}</p>
                </div>
              )}

              {activity?.address && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                  <p className="text-gray-600">{activity.address}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {activity?.address && (
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(activity.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors block text-center"
                  >
                    Get Directions
                  </a>
                )}
                
                {activity?.website_url && (
                  <a
                    href={activity.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors block text-center"
                  >
                    Visit Website
                  </a>
                )}

                {activity?.booking_url && (
                  <a
                    href={activity.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors block text-center"
                  >
                    Book Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;