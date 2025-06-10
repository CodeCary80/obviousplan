import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Ready to plan another amazing evening?</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* New Plan Card */}
        <Link
          to="/"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Plan</h3>
            <p className="text-gray-600 text-sm">Start planning your next perfect evening</p>
          </div>
        </Link>

        {/* Favorites Card */}
        <Link
          to="/dashboard/favorites"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Favorites</h3>
            <p className="text-gray-600 text-sm">View your saved evening plans</p>
          </div>
        </Link>

        {/* History Card */}
        <Link
          to="/dashboard/history"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">History</h3>
            <p className="text-gray-600 text-sm">See your past evening plans</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;