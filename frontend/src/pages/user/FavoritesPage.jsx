import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StarRating from '../../components/common/StarRating';
import { Link } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      console.log('Fetching favorites...'); 
      const response = await userAPI.getFavorites();
      console.log('Favorites response:', response); 
      
      if (response.data.success) {
        setFavorites(response.data.data.favorites);
        console.log('Favorites loaded:', response.data.data.favorites); 
      } else {
        setError('Failed to load favorites');
      }
    } catch (error) {
      console.error('Fetch favorites error:', error);
      setError('Failed to load favorites: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    if (!confirm('Remove this plan from favorites?')) return;
    
    try {
      await userAPI.removeFromFavorites(favoriteId);
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Remove favorite error:', error);
      alert('Failed to remove favorite');
    }
  };

  const renderRating = (rating) => {
    if (!rating) {
      return (
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-gray-300 text-sm">☆</span>
            ))}
          </div>
          <span className="text-gray-400 text-sm">Not rated</span>
        </div>
      );
    }
    
    return (
      <StarRating
        rating={rating}
        onRatingChange={null}
        size="sm"
        interactive={false}
      />
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading your favorites..." />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-600">Your saved evening plans ({favorites.length} total)</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchFavorites}
            className="mt-2 text-red-700 underline text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-4xl mb-4">❤️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600 mb-4">Save your favorite evening plans to see them here</p>
          <Link 
            to="/"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create a Plan
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Plan Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {favorite.restaurant?.name || 'Unknown Restaurant'} + {favorite.activity?.activity_title || 'Unknown Activity'}
                  </h3>
                  
                  {/* Plan Details */}
                  <p className="text-gray-600 text-sm mb-2">
                    {favorite.restaurant?.cuisine_type || 'Cuisine'} • {favorite.activity?.activity_type || 'Activity'}
                  </p>
                  
                  {/* Budget */}
                  <p className="text-gray-500 text-sm mb-3">
                    Total Budget: ${favorite.total_budget || 'N/A'}
                  </p>

                  {/* Rating Section */}
                  {favorite.rating && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700 block mb-1">Your Rating:</span>
                      {renderRating(favorite.rating)}
                    </div>
                  )}

                  {/* Comment Section  */}
                  {favorite.comment && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700 block mb-1">Your Review:</span>
                      <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border-l-4 border-purple-300">
                        "{favorite.comment}"
                      </p>
                    </div>
                  )}
                  
                  {/* Personal Notes */}
                  {favorite.user_notes && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700 block mb-1">Notes:</span>
                      <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded border-l-4 border-yellow-300">
                        {favorite.user_notes}
                      </p>
                    </div>
                  )}
                  
                  {/* Saved Date */}
                  <p className="text-gray-400 text-xs mt-3">
                    ❤️ Saved: {new Date(favorite.saved_at).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  <Link
                    to={`/confirmation/${favorite.schedule_hash}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors text-center"
                  >
                    View Plan
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;