import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ReviewCard from '../components/ReviewCard';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const FeaturedReviews = () => {
  const [filter, setFilter] = useState('all'); // all, recent, popular
  
  const { data: featuredReviews, isLoading } = useQuery(
    ['featuredReviews', filter],
    () => api.get('/reviews/featured').then(res => {
      const reviews = res.data;
      // 根据筛选条件排序
      if (filter === 'recent') {
        return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (filter === 'popular') {
        return reviews.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      }
      return reviews;
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <ChatBubbleLeftRightIcon className="w-8 h-8 text-yellow-500 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Critics' Featured Reviews</h1>
      </div>

      <p className="text-gray-600 mb-8">
        Explore handpicked reviews from our professional movie critics, offering deeper insights and expert analysis.
      </p>

      {/* 过滤器 */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('all')}
        >
          All Reviews
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            filter === 'recent' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('recent')}
        >
          Most Recent
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            filter === 'popular' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('popular')}
        >
          Most Popular
        </button>
      </div>

      {/* 评论列表 */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      ) : featuredReviews?.length > 0 ? (
        <div className="space-y-6">
          {featuredReviews.map(review => (
            <ReviewCard key={review._id} review={review} detailed={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No featured reviews yet</p>
          <Link to="/search" className="text-primary-600 hover:underline">
            Discover movies to review →
          </Link>
        </div>
      )}
    </div>
  );
};

export default FeaturedReviews; 