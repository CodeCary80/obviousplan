import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../services/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Button from '../../../components/common/button';

const ManageRestaurantsPage = () => {
  // State management
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingRestaurant, setViewingRestaurant] = useState(null);

  // Form state with all restaurant fields
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    cuisine_type: '',
    description_snippet: '',
    budget_tag: '$',
    budget_display_text: '',
    energy_tag: 'Low',
    people_tag: 'Solo',
    people_display_text: '',
    ambiance_tags: '',
    website_url: '',
    booking_url: '',
    phone_number: '',
    curated_image_url: ''
  });

  // Initial data fetch
  useEffect(() => {
    fetchRestaurants();
  }, [currentPage, searchTerm]);

  // API Functions
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: searchTerm,
        per_page: 10
      };
      
      const response = await adminAPI.getRestaurants(params);
      if (response.data.success) {
        setRestaurants(response.data.data.restaurants);
        setTotalPages(response.data.data.pagination.last_page);
      }
    } catch (error) {
      setError('Failed to fetch restaurants');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openModal = (restaurant = null) => {
    if (restaurant) {
      setEditingRestaurant(restaurant);
      setFormData({
        name: restaurant.name || '',
        address: restaurant.address || '',
        latitude: restaurant.latitude || '',
        longitude: restaurant.longitude || '',
        cuisine_type: restaurant.cuisine_type || '',
        description_snippet: restaurant.description_snippet || '',
        budget_tag: restaurant.budget_tag || '$',
        budget_display_text: restaurant.budget_display_text || '',
        energy_tag: restaurant.energy_tag || 'Low',
        people_tag: restaurant.people_tag || 'Solo',
        people_display_text: restaurant.people_display_text || '',
        ambiance_tags: restaurant.ambiance_tags || '',
        website_url: restaurant.website_url || '',
        booking_url: restaurant.booking_url || '',
        phone_number: restaurant.phone_number || '',
        curated_image_url: restaurant.curated_image_url || ''
      });
    } else {
      setEditingRestaurant(null);
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        cuisine_type: '',
        description_snippet: '',
        budget_tag: '$',
        budget_display_text: '',
        energy_tag: 'Low',
        people_tag: 'Solo',
        people_display_text: '',
        ambiance_tags: '',
        website_url: '',
        booking_url: '',
        phone_number: '',
        curated_image_url: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRestaurant(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingRestaurant) {
        await adminAPI.updateRestaurant(editingRestaurant.id, formData);
      } else {
        await adminAPI.createRestaurant(formData);
      }
      
      closeModal();
      fetchRestaurants();
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await adminAPI.deleteRestaurant(id);
      fetchRestaurants();
      setDeleteConfirm(null);
      setError('');
    } catch (error) {
      setError('Failed to delete restaurant');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (restaurant) => {
    setDeleteConfirm(restaurant);
  };

  // Loading state
  if (loading && restaurants.length === 0) {
    return <LoadingSpinner message="Loading restaurants..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Restaurants</h1>
          <p className="text-gray-600">Add, edit, and manage restaurant database</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700"
        >
          Add New Restaurant
        </Button>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Restaurants Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {restaurants.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No restaurants found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuisine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Energy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      People
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location Set
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {restaurants.map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer"
                             onClick={() => setViewingRestaurant(restaurant)}>
                          {restaurant.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {restaurant.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{restaurant.cuisine_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {restaurant.budget_tag}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {restaurant.energy_tag}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {restaurant.people_tag}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          restaurant.latitude && restaurant.longitude
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {restaurant.latitude && restaurant.longitude ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(restaurant)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(restaurant)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Details Modal */}
      {viewingRestaurant && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Restaurant Details</h3>
                <button
                  onClick={() => setViewingRestaurant(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingRestaurant.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cuisine Type</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingRestaurant.cuisine_type}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{viewingRestaurant.address}</p>
                </div>

                {(viewingRestaurant.latitude || viewingRestaurant.longitude) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Latitude</label>
                      <p className="mt-1 text-sm text-gray-900">{viewingRestaurant.latitude || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Longitude</label>
                      <p className="mt-1 text-sm text-gray-900">{viewingRestaurant.longitude || 'Not set'}</p>
                    </div>
                  </div>
                )}

                {viewingRestaurant.description_snippet && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingRestaurant.description_snippet}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget</label>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {viewingRestaurant.budget_tag}
                      </span>
                      {viewingRestaurant.budget_display_text && (
                        <p className="text-sm text-gray-600 mt-1">{viewingRestaurant.budget_display_text}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Energy Level</label>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {viewingRestaurant.energy_tag}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">People</label>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {viewingRestaurant.people_tag}
                      </span>
                      {viewingRestaurant.people_display_text && (
                        <p className="text-sm text-gray-600 mt-1">{viewingRestaurant.people_display_text}</p>
                      )}
                    </div>
                  </div>
                </div>

                {viewingRestaurant.ambiance_tags && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ambiance Tags</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingRestaurant.ambiance_tags}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingRestaurant.website_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Website</label>
                      <a 
                        href={viewingRestaurant.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  {viewingRestaurant.booking_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Booking</label>
                      <a 
                        href={viewingRestaurant.booking_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Make Reservation
                      </a>
                    </div>
                  )}
                </div>

                {viewingRestaurant.phone_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <a 
                      href={`tel:${viewingRestaurant.phone_number}`}
                      className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {viewingRestaurant.phone_number}
                    </a>
                  </div>
                )}

                {viewingRestaurant.curated_image_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <img 
                      src={viewingRestaurant.curated_image_url} 
                      alt={viewingRestaurant.name}
                      className="mt-1 w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setViewingRestaurant(null);
                    openModal(viewingRestaurant);
                  }}
                  variant="outline"
                >
                  Edit Restaurant
                </Button>
                <Button
                  onClick={() => setViewingRestaurant(null)}
                  variant="primary"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Restaurant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cuisine Type *
                    </label>
                    <input
                      type="text"
                      name="cuisine_type"
                      value={formData.cuisine_type}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Italian, Thai, American"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Address & Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description_snippet"
                    value={formData.description_snippet}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tags Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Tag *
                    </label>
                    <select
                      name="budget_tag"
                      value={formData.budget_tag}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="$">$</option>
                      <option value="$$">$$</option>
                      <option value="$$$">$$$</option>
                      <option value="$$$$">$$$$</option>
                      <option value="$$$$$">$$$$$</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Energy Tag *
                    </label>
                    <select
                      name="energy_tag"
                      value={formData.energy_tag}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      People Tag *
                    </label>
                    <select
                      name="people_tag"
                      value={formData.people_tag}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Solo">Solo</option>
                      <option value="Date">Date</option>
                      <option value="Small Group">Small Group</option>
                      <option value="Large Group">Large Group</option>
                    </select>
                  </div>
                </div>

                {/* Display Text Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Display Text
                    </label>
                    <input
                      type="text"
                      name="budget_display_text"
                      value={formData.budget_display_text}
                      onChange={handleInputChange}
                      placeholder="e.g., $25-45 per person"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      People Display Text
                    </label>
                    <input
                      type="text"
                      name="people_display_text"
                      value={formData.people_display_text}
                      onChange={handleInputChange}
                      placeholder="e.g., Perfect for couples"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Ambiance Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ambiance Tags
                  </label>
                  <input
                    type="text"
                    name="ambiance_tags"
                    value={formData.ambiance_tags}
                    onChange={handleInputChange}
                    placeholder="e.g., Romantic,Cozy,Outdoor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* URLs and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking URL
                    </label>
                    <input
                      type="url"
                      name="booking_url"
                      value={formData.booking_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="curated_image_url"
                      value={formData.curated_image_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={closeModal}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    loading={loading}
                  >
                    {editingRestaurant ? 'Update' : 'Create'} Restaurant
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Delete Restaurant</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 pt-4">
                <Button
                  onClick={() => setDeleteConfirm(null)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  variant="danger"
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRestaurantsPage;