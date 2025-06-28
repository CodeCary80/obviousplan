import React, { useState } from 'react';

const StarRating = ({ 
  rating, 
  onRatingChange, 
  size = 'md', 
  interactive = true
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const getRatingLabel = (currentRating) => {
    const labels = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return labels[currentRating] || '';
  };

  const handleClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue) => {
    if (interactive) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const currentRating = hoverRating || rating;

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={!interactive}
            className={`${sizes[size]} transition-all duration-200 transform ${
              interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
            } focus:outline-none ${
              star <= currentRating
                ? 'text-yellow-400 drop-shadow-lg'
                : 'text-gray-300'
            }`}
            aria-label={`${interactive ? 'Rate' : 'Rated'} ${star} star${star > 1 ? 's' : ''}`}
          >
            {star <= currentRating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;