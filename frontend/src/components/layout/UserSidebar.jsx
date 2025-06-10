import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  HeartIcon, 
  ClockIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const UserSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Favorites', href: '/dashboard/favorites', icon: HeartIcon },
    { name: 'History', href: '/dashboard/history', icon: ClockIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-sm h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive(item.href)
                    ? 'bg-purple-100 text-purple-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon
                  className={`
                    mr-3 h-5 w-5
                    ${isActive(item.href)
                      ? 'text-purple-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                    }
                  `}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link
            to="/"
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <HomeIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            New Plan
          </Link>
          
          <button
            onClick={logout}
            className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default UserSidebar;