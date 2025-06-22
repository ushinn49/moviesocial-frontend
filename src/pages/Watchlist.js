import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { BookmarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const Watchlist = () => {
  const queryClient = useQueryClient();

  const { data: watchlist, isLoading } = useQuery(
    'watchlist',
    () => api.get('/watchlist').then(res => res.data)
  );

  const removeMutation = useMutation(
    (movieId) => api.delete(`/watchlist/remove/${movieId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('watchlist');
        toast.success('Removed from watchlist');
      }
    }
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-48 rounded mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const movies = watchlist?.movies || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BookmarkIcon className="w-8 h-8 mr-3 text-primary-600" />
          My Watchlist
        </h1>
        <p className="text-gray-600 mt-2">
          {movies.length} {movies.length === 1 ? 'movie' : 'movies'} saved
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BookmarkIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 mb-4">Your watchlist is empty</p>
          <Link
            to="/search"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Discover Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => {
            const posterUrl = movie.moviePoster
              ? `https://image.tmdb.org/t/p/w200${movie.moviePoster}`
              : 'https://via.placeholder.com/200x300';

            return (
              <div key={movie.movieId} className="group relative">
                <Link to={`/movie/${movie.movieId}`}>
                  <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <img
                      src={posterUrl}
                      alt={movie.movieTitle}
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm">
                          Added {format(new Date(movie.addedAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 truncate">
                    {movie.movieTitle}
                  </h3>
                </Link>
                
                <button
                  onClick={() => removeMutation.mutate(movie.movieId)}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  title="Remove from watchlist"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist;