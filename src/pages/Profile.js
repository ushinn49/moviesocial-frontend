import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import ReviewCard from '../components/ReviewCard';
import toast from 'react-hot-toast';
import { Tab } from '@headlessui/react';
import { 
  FilmIcon, 
  UsersIcon, 
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const isOwnProfile = !id || id === currentUser?.id;
  const profileId = id || currentUser?.id;

  const { data: profile, isLoading } = useQuery(
    ['profile', profileId],
    () => api.get(`/users/${profileId}`).then(res => res.data),
    { enabled: !!profileId }
  );

  const { data: reviews } = useQuery(
    ['userReviews', profileId],
    () => api.get(`/users/${profileId}/reviews`).then(res => res.data),
    { enabled: !!profileId }
  );

  const { data: followers } = useQuery(
    ['followers', profileId],
    () => api.get(`/users/${profileId}/followers`).then(res => res.data),
    { enabled: !!profileId }
  );

  const { data: following } = useQuery(
    ['following', profileId],
    () => api.get(`/users/${profileId}/following`).then(res => res.data),
    { enabled: !!profileId }
  );

  const followMutation = useMutation(
    () => api.post(`/follows/${profileId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile', profileId]);
        queryClient.invalidateQueries(['followers', profileId]);
        toast.success('Successfully followed user');
      }
    }
  );

  const unfollowMutation = useMutation(
    () => api.delete(`/follows/${profileId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile', profileId]);
        queryClient.invalidateQueries(['followers', profileId]);
        toast.success('Successfully unfollowed user');
      }
    }
  );

  const updateProfileMutation = useMutation(
    (data) => api.put(`/users/${profileId}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['profile', profileId]);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    }
  );

  const handleEdit = () => {
    setEditData({
      bio: profile.bio || '',
      avatar: '/apple-touch-icon.png',
      favoriteGenres: profile.favoriteGenres || [],
      isPrivate: profile.isPrivate || false
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editData);
  };

  const handleFollow = () => {
    if (profile.isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="/apple-touch-icon.png"
              alt={profile.username}
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                {profile.role === 'critic' && (
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                    Verified Critic
                  </span>
                )}
                {profile.role === 'admin' && (
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {isOwnProfile ? (
            <button
              onClick={isEditing ? handleSave : handleEdit}
              disabled={updateProfileMutation.isLoading}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {isEditing ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <PencilIcon className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          ) : currentUser && (
            <button
              onClick={handleFollow}
              disabled={followMutation.isLoading || unfollowMutation.isLoading}
              className={`px-4 py-2 rounded-md ${
                profile.isFollowing
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {profile.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}

          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="ml-2 p-2 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bio */}
        <div className="mt-4">
          {isEditing ? (
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-700">{profile.bio || 'No bio yet.'}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{profile.stats?.reviews || 0}</p>
            <p className="text-sm text-gray-600">Reviews</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{profile.stats?.followers || 0}</p>
            <p className="text-sm text-gray-600">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{profile.stats?.following || 0}</p>
            <p className="text-sm text-gray-600">Following</p>
          </div>
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
            <FilmIcon className="w-5 h-5 inline mr-2" />
            Reviews ({reviews?.length || 0})
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-white text-primary-700 shadow' 
                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'}`
            }
          >
            <UsersIcon className="w-5 h-5 inline mr-2" />
            Followers ({followers?.length || 0})
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-white text-primary-700 shadow' 
                : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'}`
            }
          >
            <UsersIcon className="w-5 h-5 inline mr-2" />
            Following ({following?.length || 0})
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-4">
          {/* Reviews Panel */}
          <Tab.Panel>
            {reviews?.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(review => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No reviews yet
              </p>
            )}
          </Tab.Panel>

          {/* Followers Panel */}
          <Tab.Panel>
            {followers?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followers.map(follower => (
                  <Link
                    key={follower._id}
                    to={`/profile/${follower._id}`}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src="/apple-touch-icon.png"
                        alt={follower.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{follower.username}</p>
                        <p className="text-sm text-gray-600">{follower.bio}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No followers yet
              </p>
            )}
          </Tab.Panel>

          {/* Following Panel */}
          <Tab.Panel>
            {following?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {following.map(user => (
                  <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src="/apple-touch-icon.png"
                        alt={user.username}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-600">{user.bio}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Not following anyone yet
              </p>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Profile;