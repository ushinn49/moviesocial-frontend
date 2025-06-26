import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import ReviewCard from '../components/ReviewCard';
import { StarIcon, FilmIcon, UsersIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const { data: trendingMovies, isLoading: loadingTrending } = useQuery(
    'trendingMovies',
    () => api.get('/movies/trending/week').then(res => res.data)
  );

  const { data: recentReviews, isLoading: loadingReviews } = useQuery(
    'recentReviews',
    () => api.get('/reviews/recent').then(res => res.data)
  );

  const { data: userReviews } = useQuery(
    ['userReviews', user?.id],
    () => api.get(`/users/${user.id}/reviews`).then(res => res.data),
    { enabled: !!user }
  );

  const { data: featuredReviews, isLoading: loadingFeatured } = useQuery(
    'featuredReviews',
    () => api.get('/reviews/featured').then(res => res.data)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to MovieSocial</h1>
        <p className="text-xl mb-6">
          Discover movies, share reviews, and connect with fellow movie enthusiasts
        </p>
        
        {!isAuthenticated && (
          <Link
            to="/register"
            className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Join Our Community
          </Link>
        )}
        
        {isAuthenticated && (
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg">
            <div className="text-center">
              <FilmIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{userReviews?.length || 0}</p>
              <p className="text-sm">Reviews</p>
            </div>
            <div className="text-center">
              <StarIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {user?.role === 'critic' ? 'Critic' : 'Member'}
              </p>
              <p className="text-sm">Status</p>
            </div>
            <div className="text-center">
              <UsersIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">Active</p>
              <p className="text-sm">Community</p>
            </div>
          </div>
        )}
      </div>

      {featuredReviews?.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              <ChatBubbleLeftRightIcon className="w-6 h-6 inline-block mr-2 text-yellow-500" />
              Critics' Choice
            </h2>
            <Link to="/reviews/featured" className="text-primary-600 hover:text-primary-700">
              View All →
            </Link>
          </div>
          
          {loadingFeatured ? (
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {featuredReviews.slice(0, 3).map(review => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Trending Movies */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Trending This Week</h2>
          <Link to="/search" className="text-primary-600 hover:text-primary-700">
            View All →
          </Link>
        </div>
        
        {loadingTrending ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingMovies?.slice(0, 6).map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Reviews */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Reviews</h2>
        
        {loadingReviews ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-32"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentReviews?.map(review => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;