import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Public pages
import HomePage from './pages/public/HomePage';
import ResultsPage from './pages/public/ResultsPage';
import RestaurantDetailPage from './pages/public/RestaurantDetailPage';
import ActivityDetailPage from './pages/public/ActivityDetailPage';
import ConfirmationPage from './pages/public/ConfirmationPage';
import FeedbackPage from './pages/public/FeedbackPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import FavoritesPage from './pages/user/FavoritesPage';
import HistoryPage from './pages/user/HistoryPage';

// Admin pages
import AdminDashboard from './pages/user/admin/AdminDashboard';
import ManageRestaurantsPage from './pages/user/admin/ManageRestaurantsPage';
import ManageActivitiesPage from './pages/user/admin/ManageActivitiesPage';
import ManageTipsPage from './pages/user/admin/ManageTipsPage';
import ManageUsersPage from './pages/user/admin/ManageUsersPage';

// Layout components
import PublicLayout from './components/layout/PublicLayout';
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';

// Protected route components
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  // Redirect authenticated users to appropriate dashboard
  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="results/:hash" element={<ResultsPage />} />
        <Route path="restaurant/:id" element={<RestaurantDetailPage />} />
        <Route path="activity/:id" element={<ActivityDetailPage />} />
        <Route path="confirmation/:hash" element={<ConfirmationPage />} />
        <Route path="feedback/:hash" element={<FeedbackPage />} />
      </Route>

      {/* Auth routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* User routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserLayout />
        </ProtectedRoute>
      }>
        <Route index element={<UserDashboard />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="restaurants" element={<ManageRestaurantsPage />} />
        <Route path="activities" element={<ManageActivitiesPage />} />
        <Route path="tips" element={<ManageTipsPage />} />
        <Route path="users" element={<ManageUsersPage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;