import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Search = () => {
  const { query: urlQuery } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(urlQuery || '');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery(
    ['searchMovies', urlQuery, page],
    () => api.get('/movies/search', { params: { query: urlQuery, page } }).then(res => res.data),
    { enabled: !!urlQuery }
  );

  useEffect(() => {
    setSearchQuery(urlQuery || '');
  }, [urlQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
      setPage(1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Movies</h1>
        
        <form onSubmit={handleSearch} className="max-w-lg mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {urlQuery && (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Showing results for: <span className="font-semibold">{urlQuery}</span>
            </p>
            {data && (
              <p className="text-sm text-gray-500">
                {data.total_results} results found
              </p>
            )}
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">Error loading search results</p>
            </div>
          )}

          {data && data.results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No movies found for your search</p>
            </div>
          )}

          {data && data.results.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.results.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {data.total_pages > 1 && (
                <div className="mt-8 flex justify-center space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {page} of {data.total_pages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(data.total_pages, p + 1))}
                    disabled={page === data.total_pages}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {!urlQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-8">
            Start searching to discover amazing movies
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Popular Searches</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/search/marvel')}
                  className="text-primary-600 hover:underline block"
                >
                  Marvel Movies
                </button>
                <button
                  onClick={() => navigate('/search/star wars')}
                  className="text-primary-600 hover:underline block"
                >
                  Star Wars
                </button>
                <button
                  onClick={() => navigate('/search/pixar')}
                  className="text-primary-600 hover:underline block"
                >
                  Pixar Films
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Genres</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/search/action')}
                  className="text-primary-600 hover:underline block"
                >
                  Action
                </button>
                <button
                  onClick={() => navigate('/search/comedy')}
                  className="text-primary-600 hover:underline block"
                >
                  Comedy
                </button>
                <button
                  onClick={() => navigate('/search/drama')}
                  className="text-primary-600 hover:underline block"
                >
                  Drama
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Trending</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/search/2024')}
                  className="text-primary-600 hover:underline block"
                >
                  2024 Movies
                </button>
                <button
                  onClick={() => navigate('/search/oscar')}
                  className="text-primary-600 hover:underline block"
                >
                  Oscar Winners
                </button>
                <button
                  onClick={() => navigate('/search/netflix')}
                  className="text-primary-600 hover:underline block"
                >
                  Netflix Originals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;