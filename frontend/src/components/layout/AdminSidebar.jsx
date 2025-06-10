import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  BuildingStorefrontIcon,
  PlayIcon,
  LightBulbIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Restaurants', href: '/admin/restaurants', icon: BuildingStorefrontIcon },
    { name: 'Activities', href: '/admin/activities', icon: PlayIcon },
    { name: 'Tips', href: '/admin/tips', icon: LightBulbIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
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
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon
                  className={`
                    mr-3 h-5 w-5
                    ${isActive(item.href)
                      ? 'text-blue-500'
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
            Public Site
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

export default AdminSidebar;