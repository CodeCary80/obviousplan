import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../../services/api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Button from '../../../components/common/button';

const ManageTipsPage = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTip, setEditingTip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    tip_text: '',
    applies_to_activity_type: '',
    applies_to_budget_tag: '',
    applies_to_energy_tag: '',
    is_generic: true
  });

  useEffect(() => {
    fetchTips();
  }, [currentPage, searchTerm]);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: searchTerm,
        per_page: 10
      };
      
      const response = await adminAPI.getTips(params);
      if (response.data.success) {
        setTips(response.data.data.tips);
        setTotalPages(response.data.data.pagination.last_page);
      }
    } catch (error) {
      setError('Failed to fetch tips');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openModal = (tip = null) => {
    if (tip) {
      setEditingTip(tip);
      setFormData({
        tip_text: tip.tip_text,
        applies_to_activity_type: tip.applies_to_activity_type || '',
        applies_to_budget_tag: tip.applies_to_budget_tag || '',
        applies_to_energy_tag: tip.applies_to_energy_tag || '',
        is_generic: tip.is_generic
      });
    } else {
      setEditingTip(null);
      setFormData({
        tip_text: '',
        applies_to_activity_type: '',
        applies_to_budget_tag: '',
        applies_to_energy_tag: '',
        is_generic: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTip(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const cleanData = {
        ...formData,
        applies_to_activity_type: formData.applies_to_activity_type || null,
        applies_to_budget_tag: formData.applies_to_budget_tag || null,
        applies_to_energy_tag: formData.applies_to_energy_tag || null,
      };
      
      if (editingTip) {
        await adminAPI.updateTip(editingTip.id, cleanData);
      } else {
        await adminAPI.createTip(cleanData);
      }
      
      closeModal();
      fetchTips();
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save tip');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await adminAPI.deleteTip(id);
      fetchTips();
      setDeleteConfirm(null);
      setError('');
    } catch (error) {
      setError('Failed to delete tip');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (tip) => {
    setDeleteConfirm(tip);
  };

  if (loading && tips.length === 0) {
    return <LoadingSpinner message="Loading tips..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Tips</h1>
          <p className="text-gray-600">Add, edit, and manage tips and suggestions</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700"
        >
          Add New Tip
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tips..."
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

      {/* Tips Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {tips.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No tips found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip Text
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget Tag
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Energy Tag
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tips.map((tip) => (
                    <tr key={tip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md">
                          {tip.tip_text.length > 100 
                            ? `${tip.tip_text.substring(0, 100)}...` 
                            : tip.tip_text
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tip.applies_to_activity_type || 'Any'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tip.applies_to_budget_tag || 'Any'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tip.applies_to_energy_tag || 'Any'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tip.is_generic
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {tip.is_generic ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(tip)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(tip)}
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
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTip ? 'Edit Tip' : 'Add New Tip'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tip Text *
                  </label>
                  <textarea
                    name="tip_text"
                    value={formData.tip_text}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="e.g., Consider grabbing a coffee nearby before your activity"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Type (Optional)
                    </label>
                    <input
                      type="text"
                      name="applies_to_activity_type"
                      value={formData.applies_to_activity_type}
                      onChange={handleInputChange}
                      placeholder="e.g., Movie, Bowling"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for all activity types</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Tag (Optional)
                    </label>
                    <select
                      name="applies_to_budget_tag"
                      value={formData.applies_to_budget_tag}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Budget</option>
                      <option value="$">$</option>
                      <option value="$$">$$</option>
                      <option value="$$$">$$$</option>
                      <option value="$$$$">$$$$</option>
                      <option value="$$$$$">$$$$$</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Energy Tag (Optional)
                    </label>
                    <select
                      name="applies_to_energy_tag"
                      value={formData.applies_to_energy_tag}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Energy</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_generic"
                    name="is_generic"
                    checked={formData.is_generic}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_generic" className="ml-2 block text-sm text-gray-700">
                    This is a generic tip (can be shown for any plan)
                  </label>
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
                    {editingTip ? 'Update' : 'Create'} Tip
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
              <h3 className="text-lg font-medium text-gray-900">Delete Tip</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this tip? This action cannot be undone.
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

export default ManageTipsPage;