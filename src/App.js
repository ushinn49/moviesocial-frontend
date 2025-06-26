import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import AdminDashboard from './pages/AdminDashboard';
import FeaturedReviews from './pages/FeaturedReviews';
import About from './pages/About';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Navigate to="/" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/:query" element={<Search />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/reviews/featured" element={<FeaturedReviews />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;