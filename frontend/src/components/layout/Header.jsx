import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-purple-600">Chillax Pack</h1>
          </Link>
          
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name}
                </span>
                {user?.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;