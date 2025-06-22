import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { StarIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import api from '../services/api';

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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start space-x-4">
        {!detailed && (
          <Link to={`/movie/${review.movieId}`}>
            <img
              src={posterUrl}
              alt={review.movieTitle}
              className="w-16 h-24 rounded object-cover"
            />
          </Link>
        )}
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              {!detailed && (
                <Link 
                  to={`/movie/${review.movieId}`}
                  className="font-semibold text-lg hover:text-primary-600"
                >
                  {review.movieTitle}
                </Link>
              )}
              
              <div className="flex items-center mt-1">
                <Link
                  to={`/profile/${review.user._id}`}
                  className="flex items-center hover:text-primary-600"
                >
                  <img
                    src={review.user.avatar || 'https://via.placeholder.com/40'}
                    alt={review.user.username}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-sm font-medium">{review.user.username}</span>
                  {review.user.role === 'critic' && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Critic
                    </span>
                  )}
                </Link>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(review.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating / 2 ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                />
              ))}
              <span className="ml-2 font-semibold">{review.rating}/10</span>
            </div>
          </div>
          
          <p className="mt-3 text-gray-700 whitespace-pre-line">
            {detailed || review.reviewText.length <= 200
              ? review.reviewText
              : `${review.reviewText.substring(0, 200)}...`}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => user ? likeMutation.mutate() : null}
              disabled={!user}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 disabled:cursor-not-allowed"
            >
              {isLiked ? (
                <HeartIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartOutline className="w-5 h-5" />
              )}
              <span>{review.likes?.length || 0}</span>
            </button>
            
            {!detailed && (
              <Link
                to={`/movie/${review.movieId}`}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Read more →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;