import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

const ReviewForm = ({ movieId, movieTitle, moviePoster, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    reviewText: '',
    // 影评人专属字段
    criticTags: [],
    criticDetails: {
      screenplay: 5,
      acting: 5,
      cinematography: 5,
      soundtrack: 5,
      directing: 5
    }
  });

  const isCritic = user?.role === 'critic';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDetailRatingChange = (field, value) => {
    setFormData({
      ...formData,
      criticDetails: {
        ...formData.criticDetails,
        [field]: value
      }
    });
  };

  const handleTagToggle = (tag) => {
    if (formData.criticTags.includes(tag)) {
      setFormData({
        ...formData,
        criticTags: formData.criticTags.filter(t => t !== tag)
      });
    } else {
      setFormData({
        ...formData,
        criticTags: [...formData.criticTags, tag]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.reviewText.length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const review = await api.post('/reviews', {
        movieId,
        movieTitle,
        moviePoster,
        rating: parseInt(formData.rating),
        reviewText: formData.reviewText
      });

      // 如果是影评人，添加额外数据
      if (isCritic && review.data._id) {
        if (formData.criticTags.length > 0) {
          await api.post(`/reviews/${review.data._id}/tags`, {
            tags: formData.criticTags
          });
        }

        await api.post(`/reviews/${review.data._id}/critic-details`, formData.criticDetails);
      }

      toast.success('Review posted successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post review');
    } finally {
      setLoading(false);
    }
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            className="focus:outline-none"
          >
            {star <= formData.rating ? (
              <StarIcon className="w-6 h-6 text-yellow-500" />
            ) : (
              <StarOutlineIcon className="w-6 h-6 text-gray-400" />
            )}
          </button>
        ))}
        <span className="ml-2 text-gray-700">{formData.rating}/10</span>
      </div>
    );
  };

  const renderDetailRatingField = (field, label) => {
    return (
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleDetailRatingChange(field, star)}
              className="focus:outline-none"
            >
              {star <= formData.criticDetails[field] ? (
                <StarIcon className="w-4 h-4 text-yellow-500" />
              ) : (
                <StarOutlineIcon className="w-4 h-4 text-gray-400" />
              )}
            </button>
          ))}
          <span className="ml-2 text-xs text-gray-600">{formData.criticDetails[field]}/10</span>
        </div>
      </div>
    );
  };

  const availableTags = ['must-watch', 'overrated', 'underrated', 'classic', 'innovative', 'disappointing'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          {renderRatingStars()}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review
          </label>
          <textarea
            name="reviewText"
            value={formData.reviewText}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Share your thoughts about this movie..."
            required
          />
        </div>

        {/* 影评人专属功能 */}
        {isCritic && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Critic Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      formData.criticTags.includes(tag)
                        ? 'bg-primary-100 text-primary-800 border-primary-300'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    } border`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Rating Details
              </label>
              <div className="bg-gray-50 p-3 rounded-md">
                {renderDetailRatingField('screenplay', 'Screenplay')}
                {renderDetailRatingField('acting', 'Acting')}
                {renderDetailRatingField('cinematography', 'Cinematography')}
                {renderDetailRatingField('soundtrack', 'Soundtrack')}
                {renderDetailRatingField('directing', 'Directing')}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;