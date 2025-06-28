import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-white">Chillax Pack</h1>
            </Link>
            <p className="text-purple-200 mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button - FIXED: Explicit text color */}
            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password}
              className="w-full bg-white hover:bg-gray-100 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-purple-900"
            >
              {loading ? (
                <span className="flex items-center justify-center text-purple-900">
                  <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full mr-2"></div>
                  Signing in...
                </span>
              ) : (
                <span className="text-purple-900">Sign In</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-purple-200 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-white font-medium hover:underline"
              >
                Register here
              </Link>
            </p>
            
            <div className="mt-4 pt-4 border-t border-white/20">
              <Link 
                to="/" 
                className="text-purple-200 text-sm hover:text-white transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <p className="text-purple-200 text-xs mb-2">Demo Credentials:</p>
            <div className="text-xs text-purple-100 space-y-1">
              <div>Admin: admin@obviousplan.com / admin123</div>
              <div>User: user@obviousplan.com / user123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;