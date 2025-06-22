import React, { useState } from 'react';
import { useMutation } from 'react-query';
import api from '../services/api';
import toast from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const ReviewForm = ({ movieId, movieTitle, moviePoster, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const createReview = useMutation(
    (data) => api.post('/reviews', data),
    {
      onSuccess: () => {
        toast.success('Review posted successfully!');
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to post review');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (reviewText.length < 10) {
      toast.error('Review must be at least 10 characters long');
      return;
    }

    createReview.mutate({
      movieId,
      movieTitle,
      moviePoster,
      rating,
      reviewText
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center space-x-1">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoveredRating(i + 1)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                {i + 1 <= (hoveredRating || rating) ? (
                  <StarSolid className="w-6 h-6 text-yellow-400" />
                ) : (
                  <StarIcon className="w-6 h-6 text-gray-300" />
                )}
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 && `${rating}/10`}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Share your thoughts about this movie..."
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createReview.isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {createReview.isLoading ? 'Posting...' : 'Post Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;