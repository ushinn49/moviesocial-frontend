import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu } from '@headlessui/react';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  BookmarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-primary-600">MovieSocial</span>
              </Link>
              
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
                >
                  <HomeIcon className="w-5 h-5 mr-1" />
                  Home
                </Link>
                <Link
                  to="/search"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 mr-1" />
                  Search
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/watchlist"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
                  >
                    <BookmarkIcon className="w-5 h-5 mr-1" />
                    Watchlist
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center">
              {isAuthenticated ? (
                <Menu as="div" className="relative ml-3">
                  <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user?.avatar || 'https://via.placeholder.com/150'}
                      alt={user?.username}
                    />
                    <span className="ml-2 text-gray-700 font-medium hidden sm:block">
                      {user?.username}
                    </span>
                  </Menu.Button>
                  
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <UserIcon className="w-5 h-5 mr-2" />
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>
                      
                      {user?.role === 'admin' && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/admin"
                              className={`${
                                active ? 'bg-gray-100' : ''
                              } flex items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <Cog6ToothIcon className="w-5 h-5 mr-2" />
                              Admin Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6 mb-4">
            <Link to="/about" className="text-primary-600 hover:text-primary-800 font-medium">
              About
            </Link>
            <a 
              href="https://github.com/ushinn49/moviesocial-frontend" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-gray-900"
            >
              Frontend Repo
            </a>
            <a 
              href="https://github.com/ushinn49/moviesocial-backend" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-gray-900"
            >
              Backend Repo
            </a>
          </div>
          <p className="text-center text-sm text-gray-500">
            © 2024 MovieSocial. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;