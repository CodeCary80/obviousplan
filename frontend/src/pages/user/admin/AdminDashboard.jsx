import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Chillax Pack content</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Restaurants */}
        <Link
          to="/admin/restaurants"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Restaurants</h3>
            <p className="text-gray-600 text-sm">Manage restaurant database</p>
          </div>
        </Link>

        {/* Activities */}
        <Link
          to="/admin/activities"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Activities</h3>
            <p className="text-gray-600 text-sm">Manage activity database</p>
          </div>
        </Link>

        {/* Tips */}
        <Link
          to="/admin/tips"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tips</h3>
            <p className="text-gray-600 text-sm">Manage tips and suggestions</p>
          </div>
        </Link>

        {/* Users */}
        <Link
          to="/admin/users"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Users</h3>
            <p className="text-gray-600 text-sm">Manage user accounts</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;