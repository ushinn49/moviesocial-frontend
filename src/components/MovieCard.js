import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300';

  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
        />
        {movie.vote_average !== undefined && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm">{Number(movie.vote_average).toFixed(1)}</span>
          </div>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900 truncate">
        {movie.title}
      </h3>
      <p className="text-xs text-gray-500">
        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'No date'}
      </p>
    </Link>
  );
};

export default MovieCard;