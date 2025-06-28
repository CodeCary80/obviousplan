import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnPath = searchParams.get('return') || '/';
  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchRestaurant();
    checkAdminStatus();
  }, [id]);

  const checkAdminStatus = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(token && user.role === 'admin');
  };

  const fetchRestaurant = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/restaurants/${id}`, {  
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data.data.restaurant);
      } else {
        setError('Restaurant not found');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }
  
    console.log('File selected:', file.name, file.type, file.size);
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const token = localStorage.getItem('token');
      console.log('Uploading to:', `http://localhost:8000/api/admin/restaurants/${id}/upload-image`);
      
      const response = await fetch(`/api/admin/restaurants/${id}/upload-image`, {  
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
  
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setRestaurant(prev => ({
          ...prev,
          curated_image_url: data.data.image_url
        }));
        alert('Image uploaded successfully!');
      } else {
        alert(data.message || 'Upload failed');
        console.error('Upload failed:', data);
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
      const response = await fetch(`/api/admin/restaurants/${id}/delete-image`, {  
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      
      if (data.success) {
        setRestaurant(prev => ({
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
            {/* Restaurant Image */}
            <div className="relative h-64 bg-gray-300">
            <img 
              src={restaurant?.curated_image_url || "/api/placeholder/600/400"} 
              alt={restaurant?.name || "Restaurant"}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.log('Image failed to load:', e.target.src);
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-size='18' text-anchor='middle' dy='.3em' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";
              }}
            />
              
              {/* Admin Image Controls */}
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
                  
                  {restaurant?.curated_image_url && (
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
              <h1 className="text-3xl font-bold mb-2">{restaurant?.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{restaurant?.cuisine_type}</p>
              
              {restaurant?.description_snippet && (
                <p className="text-gray-700 mb-6">{restaurant.description_snippet}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Budget</h3>
                  <p className="text-gray-600">{restaurant?.budget_display_text}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Perfect For</h3>
                  <p className="text-gray-600">{restaurant?.people_display_text}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Energy Level</h3>
                  <p className="text-gray-600">{restaurant?.energy_tag}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Ambiance</h3>
                  <p className="text-gray-600">{restaurant?.ambiance_tags}</p>
                </div>
              </div>

              {restaurant?.address && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                  <p className="text-gray-600">{restaurant.address}</p>
                </div>
              )}

              {restaurant?.phone_number && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                  <p className="text-gray-600">{restaurant.phone_number}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {restaurant?.address && (
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(restaurant.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors block text-center"
                  >
                    Get Directions
                  </a>
                )}
                
                {restaurant?.website_url && (
                  <a
                    href={restaurant.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors block text-center"
                  >
                    Visit Website
                  </a>
                )}

                {restaurant?.booking_url && (
                  <a
                    href={restaurant.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors block text-center"
                  >
                    Make Reservation
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

export default RestaurantDetailPage;