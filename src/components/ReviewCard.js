import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { StarIcon, HeartIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const ReviewCard = ({ review, detailed = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const likeMutation = useMutation(
    () => api.post(`/reviews/${review._id}/like`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['movieReviews']);
        queryClient.invalidateQueries(['recentReviews']);
      }
    }
  );

  const isLiked = review.likes?.includes(user?.id);
  const posterUrl = review.moviePoster 
    ? `https://image.tmdb.org/t/p/w92${review.moviePoster}`
    : 'https://via.placeholder.com/92x138';

  const { user: reviewUser, reviewText, rating, createdAt, movieTitle, movieId, criticTags, criticDetails, isFeatured } = review;
  const isCritic = reviewUser?.role === 'critic';

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${isFeatured ? 'border-2 border-yellow-400' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Link to={`/profile/${reviewUser._id}`} className="flex items-center">
            <img
              src="/apple-touch-icon.png"
              alt={reviewUser.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium text-gray-900 flex items-center">
                {reviewUser.username}
                {isCritic && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                    Critic
                  </span>
                )}
                {isFeatured && (
                  <span className="ml-2 bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </p>
            </div>
          </Link>
        </div>
        <div className="flex items-center">
          <StarIcon className="h-5 w-5 text-yellow-400" />
          <span className="ml-1 text-lg font-bold">{rating}</span>
          <span className="text-sm text-gray-500">/10</span>
        </div>
      </div>

      {/* 电影标题链接 */}
      {!detailed && movieTitle && (
        <Link to={`/movie/${movieId}`} className="block mb-2 text-primary-600 hover:underline">
          {movieTitle}
        </Link>
      )}

      {/* Critic标签 */}
      {isCritic && criticTags && criticTags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {criticTags.map(tag => (
            <span 
              key={tag} 
              className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-gray-700">{reviewText}</p>
      
      {/* 影评人专业评分 */}
      {isCritic && criticDetails && Object.keys(criticDetails).some(k => criticDetails[k]) && detailed && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <h4 className="font-medium text-sm mb-2">Professional Rating</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {criticDetails.screenplay && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Screenplay:</span>
                <span className="font-medium">{criticDetails.screenplay}/10</span>
              </div>
            )}
            {criticDetails.acting && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Acting:</span>
                <span className="font-medium">{criticDetails.acting}/10</span>
              </div>
            )}
            {criticDetails.cinematography && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Cinematography:</span>
                <span className="font-medium">{criticDetails.cinematography}/10</span>
              </div>
            )}
            {criticDetails.soundtrack && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Soundtrack:</span>
                <span className="font-medium">{criticDetails.soundtrack}/10</span>
              </div>
            )}
            {criticDetails.directing && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Directing:</span>
                <span className="font-medium">{criticDetails.directing}/10</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 点赞信息 */}
      {review.likes && (
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <HandThumbUpIcon className="h-4 w-4 mr-1" />
          {review.likes.length} {review.likes.length === 1 ? 'like' : 'likes'}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;