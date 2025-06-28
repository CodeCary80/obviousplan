import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Password confirmation is required';
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.password_confirmation
      );
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.password && formData.password_confirmation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-white">Chillax Pack</h1>
            </Link>
            <p className="text-purple-200 mt-2">Create your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-red-300 text-xs">{errors.name}</p>
              )}
            </div>

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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-red-300 text-xs">{errors.email}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-red-300 text-xs">{errors.password}</p>
              )}
            </div>

            {/* Password Confirmation */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 ${
                  errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-red-300 text-xs">{errors.password_confirmation}</p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-white hover:bg-gray-100 font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-purple-900"
            >
              {loading ? (
                <span className="flex items-center justify-center text-purple-900">
                  <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full mr-2"></div>
                  Creating account...
                </span>
              ) : (
                <span className="text-purple-900">Create Account</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-purple-200 text-sm">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-white font-medium hover:underline"
              >
                Sign in here
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
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;