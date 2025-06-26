import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import { 
  UsersIcon, 
  FilmIcon, 
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users, isLoading: loadingUsers } = useQuery(
    'allUsers',
    () => api.get('/users').then(res => res.data)
  );

  const { data: reviews } = useQuery(
    'allReviews',
    () => api.get('/reviews/recent').then(res => res.data)
  );

  const updateRoleMutation = useMutation(
    ({ userId, role }) => api.put(`/users/${userId}/role`, { role }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('allUsers');
        toast.success('User role updated');
        setSelectedUser(null);
      }
    }
  );

  const deleteReviewMutation = useMutation(
    (reviewId) => api.delete(`/reviews/${reviewId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('allReviews');
        toast.success('Review deleted');
      }
    }
  );

  const stats = {
    totalUsers: users?.length || 0,
    critics: users?.filter(u => u.role === 'critic').length || 0,
    regularUsers: users?.filter(u => u.role === 'user').length || 0,
    totalReviews: reviews?.length || 0
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <UsersIcon className="w-8 h-8 text-primary-600 mb-2" />
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
          <p className="text-gray-600">Total Users</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <UsersIcon className="w-8 h-8 text-yellow-600 mb-2" />
          <p className="text-2xl font-bold">{stats.critics}</p>
          <p className="text-gray-600">Critics</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <UsersIcon className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold">{stats.regularUsers}</p>
          <p className="text-gray-600">Regular Users</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <FilmIcon className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold">{stats.totalReviews}</p>
          <p className="text-gray-600">Total Reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-white text-primary-700 shadow' 
                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'}`
            }
          >
            <UsersIcon className="w-5 h-5 inline mr-2" />
            Users Management
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-white text-primary-700 shadow' 
                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'}`
            }
          >
            <FilmIcon className="w-5 h-5 inline mr-2" />
            Reviews Management
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-4">
          {/* Users Panel */}
          <Tab.Panel>
            {loadingUsers ? (
              <div className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg"></div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {users?.map(user => (
                    <li key={user._id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src="/apple-touch-icon.png"
                            alt={user.username}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.username}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium
                            ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'critic' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'}`}>
                            {user.role}
                          </span>
                          
                          {selectedUser === user._id ? (
                            <div className="flex items-center space-x-2">
                              <select
                                className="text-sm border-gray-300 rounded-md"
                                onChange={(e) => {
                                  updateRoleMutation.mutate({
                                    userId: user._id,
                                    role: e.target.value
                                  });
                                }}
                                defaultValue={user.role}
                              >
                                <option value="user">User</option>
                                <option value="critic">Critic</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => setSelectedUser(null)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedUser(user._id)}
                              className="text-primary-600 hover:text-primary-900 text-sm"
                            >
                              Change Role
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Tab.Panel>

          {/* Reviews Panel */}
          <Tab.Panel>
            <div className="space-y-4">
              {reviews?.map(review => (
                <div key={review._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <img
                          src="/apple-touch-icon.png"
                          alt={review.user.username}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="font-medium">{review.user.username}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{review.movieTitle}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{review.reviewText}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this review?')) {
                          deleteReviewMutation.mutate(review._id);
                        }
                      }}
                      className="ml-4 text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AdminDashboard;