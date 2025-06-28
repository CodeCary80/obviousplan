import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin" className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">Chillax Pack</h1>
            <span className="ml-2 text-sm text-gray-500">Admin</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Hello, {user?.name}
            </span>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Public Site
            </Link>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;