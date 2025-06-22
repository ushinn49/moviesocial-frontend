import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import toast from 'react-hot-toast';
import { 
  BookmarkIcon, 
  StarIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const MovieDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: movie, isLoading: loadingMovie } = useQuery(
    ['movie', id],
    () => api.get(`/movies/${id}`).then(res => res.data)
  );

  const { data: reviews, isLoading: loadingReviews } = useQuery(
    ['movieReviews', id],
    () => api.get(`/reviews/movie/${id}`).then(res => res.data)
  );

  const { data: watchlistStatus } = useQuery(
    ['watchlistStatus', id],
    () => api.get(`/watchlist/check/${id}`).then(res => res.data),
    { enabled: isAuthenticated }
  );

  const addToWatchlist = useMutation(
    () => api.post('/watchlist/add', {
      movieId: id,
      movieTitle: movie.title,
      moviePoster: movie.poster_path
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['watchlistStatus', id]);
        toast.success('Added to watchlist!');
      },
      onError: () => {
        toast.error('Failed to add to watchlist');
      }
    }
  );

  const removeFromWatchlist = useMutation(
    () => api.delete(`/watchlist/remove/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['watchlistStatus', id]);
        toast.success('Removed from watchlist');
      }
    }
  );

  const toggleWatchlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to watchlist');
      return;
    }

    if (watchlistStatus?.inWatchlist) {
      removeFromWatchlist.mutate();
    } else {
      addToWatchlist.mutate();
    }
  };

  if (loadingMovie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-lg mb-8"></div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p>Movie not found</p>
      </div>
    );
  }

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div>
      {/* Backdrop */}
      {backdropUrl && (
        <div 
          className="h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-10">
          {/* Poster */}
          <div className="md:col-span-1">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full rounded-lg shadow-xl"
            />
          </div>

          {/* Movie Info */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{movie.title}</h1>
              <button
                onClick={toggleWatchlist}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                {watchlistStatus?.inWatchlist ? (
                  <BookmarkSolidIcon className="w-6 h-6 text-primary-600" />
                ) : (
                  <BookmarkIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {new Date(movie.release_date).getFullYear()}
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {movie.runtime} min
              </div>
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 mr-1" />
                {movie.vote_average.toFixed(1)}/10
              </div>
            </div>

            <div className="mb-4">
              {movie.genres?.map(genre => (
                <span
                  key={genre.id}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-700 mb-6">{movie.overview}</p>

            {/* Cast */}
            {movie.credits?.cast?.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Cast</h3>
                <div className="flex flex-wrap">
                  {movie.credits.cast.slice(0, 5).map(actor => (
                    <span key={actor.id} className="mr-4 mb-2 text-sm text-gray-600">
                      {actor.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Director */}
            {movie.credits?.crew && (
              <div>
                <h3 className="font-semibold mb-2">Director</h3>
                <p className="text-sm text-gray-600">
                  {movie.credits.crew.find(person => person.job === 'Director')?.name || 'N/A'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Reviews</h2>
            {isAuthenticated && !reviews?.find(r => r.user._id === isAuthenticated.id) && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <ReviewForm
              movieId={id}
              movieTitle={movie.title}
              moviePoster={movie.poster_path}
              onClose={() => setShowReviewForm(false)}
              onSuccess={() => {
                setShowReviewForm(false);
                queryClient.invalidateQueries(['movieReviews', id]);
              }}
            />
          )}

          {loadingReviews ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-32"></div>
                </div>
              ))}
            </div>
          ) : reviews?.length > 0 ? (
            <div className="space-y-4">
              {reviews.map(review => (
                <ReviewCard key={review._id} review={review} detailed />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No reviews yet. Be the first to review this movie!
            </p>
          )}
        </div>

        {/* Similar Movies */}
        {movie.similar?.results?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.similar.results.slice(0, 6).map(similarMovie => (
                <Link
                  key={similarMovie.id}
                  to={`/movie/${similarMovie.id}`}
                  className="group"
                >
                  <img
                    src={similarMovie.poster_path 
                      ? `https://image.tmdb.org/t/p/w200${similarMovie.poster_path}`
                      : 'https://via.placeholder.com/200x300'
                    }
                    alt={similarMovie.title}
                    className="w-full rounded-lg group-hover:opacity-75 transition"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-900 truncate">
                    {similarMovie.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;