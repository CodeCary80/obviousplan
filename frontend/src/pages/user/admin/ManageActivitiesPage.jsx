import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../services/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Button from '../../../components/common/button';

const ManageActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingActivity, setViewingActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    activity_title: '',
    activity_type: '',
    venue_name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    budget_tag: '$',
    budget_display_text: '',
    energy_tag: 'Low',
    people_tag: 'Solo',
    people_display_text: '',
    estimated_duration_minutes: '',
    indoor_outdoor_status: 'Indoor',
    required_materials: '',
    website_url: '',
    booking_url: '',
    curated_image_url: ''
  });

  useEffect(() => {
    fetchActivities();
  }, [currentPage, searchTerm]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: searchTerm,
        per_page: 10
      };
      
      const response = await adminAPI.getActivities(params);
      if (response.data.success) {
        setActivities(response.data.data.activities);
        setTotalPages(response.data.data.pagination.last_page);
      }
    } catch (error) {
      setError('Failed to fetch activities');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openModal = (activity = null) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        ...activity,
        estimated_duration_minutes: activity.estimated_duration_minutes || '',
        required_materials: activity.required_materials || '',
        website_url: activity.website_url || '',
        booking_url: activity.booking_url || '',
        curated_image_url: activity.curated_image_url || ''
      });
    } else {
      setEditingActivity(null);
      setFormData({
        activity_title: '',
        activity_type: '',
        venue_name: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        budget_tag: '$',
        budget_display_text: '',
        energy_tag: 'Low',
        people_tag: 'Solo',
        people_display_text: '',
        estimated_duration_minutes: '',
        indoor_outdoor_status: 'Indoor',
        required_materials: '',
        website_url: '',
        booking_url: '',
        curated_image_url: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingActivity(null);
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
      
      if (editingActivity) {
        await adminAPI.updateActivity(editingActivity.id, formData);
      } else {
        await adminAPI.createActivity(formData);
      }
      
      closeModal();
      fetchActivities();
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save activity');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await adminAPI.deleteActivity(id);
      fetchActivities();
      setDeleteConfirm(null);
      setError('');
    } catch (error) {
      setError('Failed to delete activity');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (activity) => {
    setDeleteConfirm(activity);
  };

  if (loading && activities.length === 0) {
    return <LoadingSpinner message="Loading activities..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Activities</h1>
          <p className="text-gray-600">Add, edit, and manage activity database</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700"
        >
          Add New Activity
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Activities Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No activities found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Energy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
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
                  {activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer"
                             onClick={() => setViewingActivity(activity)}>
                          {activity.activity_title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.activity_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.venue_name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {activity.budget_tag}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {activity.energy_tag}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {activity.estimated_duration_minutes ? `${Math.round(activity.estimated_duration_minutes / 60 * 10) / 10}h` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.latitude && activity.longitude
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.latitude && activity.longitude ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(activity)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(activity)}
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

            {/* Pagination */}
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Title *
                    </label>
                    <input
                      type="text"
                      name="activity_title"
                      value={formData.activity_title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Type *
                    </label>
                    <input
                      type="text"
                      name="activity_type"
                      value={formData.activity_type}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Bowling, Movie, Museum"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      name="venue_name"
                      value={formData.venue_name}
                      onChange={handleInputChange}
                      placeholder="e.g., The Ballroom Bowl"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="estimated_duration_minutes"
                      value={formData.estimated_duration_minutes}
                      onChange={handleInputChange}
                      placeholder="e.g., 120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Indoor/Outdoor
                    </label>
                    <select
                      name="indoor_outdoor_status"
                      value={formData.indoor_outdoor_status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                </div>

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
                      placeholder="e.g., $15 per person"
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
                      placeholder="e.g., 2-6 people"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Materials
                  </label>
                  <input
                    type="text"
                    name="required_materials"
                    value={formData.required_materials}
                    onChange={handleInputChange}
                    placeholder="e.g., Comfortable shoes, Water bottle"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

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
                    {editingActivity ? 'Update' : 'Create'} Activity
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* View Details Modal */}
      {viewingActivity && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Activity Details</h3>
                <button
                  onClick={() => setViewingActivity(null)}
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
                    <label className="block text-sm font-medium text-gray-700">Activity Title</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingActivity.activity_title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingActivity.activity_type}</p>
                  </div>
                </div>

                {viewingActivity.venue_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Venue</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingActivity.venue_name}</p>
                  </div>
                )}

                {viewingActivity.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingActivity.description}</p>
                  </div>
                )}

                {viewingActivity.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{viewingActivity.address}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {viewingActivity.budget_tag}
                    </span>
                    {viewingActivity.budget_display_text && (
                      <p className="text-sm text-gray-600 mt-1">{viewingActivity.budget_display_text}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Energy Level</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {viewingActivity.energy_tag}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">People</label>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {viewingActivity.people_tag}
                    </span>
                  </div>
                </div>

                {viewingActivity.estimated_duration_minutes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <p className="mt-1 text-sm text-gray-900">{Math.round(viewingActivity.estimated_duration_minutes / 60 * 10) / 10} hours</p>
                  </div>
                )}

                {viewingActivity.website_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <a 
                      href={viewingActivity.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setViewingActivity(null);
                    openModal(viewingActivity);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Edit Activity
                </button>
                <button
                  onClick={() => setViewingActivity(null)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Delete Activity</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete "{deleteConfirm.activity_title}"? This action cannot be undone.
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

export default ManageActivitiesPage;