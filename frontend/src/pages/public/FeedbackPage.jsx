import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/button';

const FeedbackPage = () => {
  const { hash } = useParams();
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isAuthenticated && rating > 0) {
      console.log('Submitting feedback:', { rating, comment });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-purple-200 mb-8">Your feedback has been saved. Enjoy your evening!</p>
          <a href="/" className="bg-white text-purple-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Plan Another Evening
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Enjoy and Rate your journey!</h1>
              <p className="text-purple-200">How was your evening?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div>
                <label className="block text-white font-medium mb-3">Rate your experience:</label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-400'
                      } hover:text-yellow-300`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Any comments? (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90"
                  rows="4"
                  placeholder="Tell us about your experience..."
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={rating === 0}
                className="w-full bg-white text-purple-900 hover:bg-gray-100 font-semibold py-2 px-4 rounded-lg"
              >
                Submit Feedback
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;