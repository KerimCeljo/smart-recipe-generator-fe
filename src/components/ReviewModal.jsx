import React, { useState } from 'react';
import { X, Star, Calendar, Send } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, recipeId, recipeTitle, onReviewSubmitted }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim() || rating === 0) {
      setError('Please provide both a review and a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const reviewData = {
        recipeId: recipeId,
        reviewText: reviewText.trim(),
        rating: rating,
        reviewDate: new Date(reviewDate).toISOString()
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/recipes/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const newReview = await response.json();
        onReviewSubmitted(newReview);
        onClose();
        // Reset form
        setReviewText('');
        setRating(0);
        setReviewDate(new Date().toISOString().split('T')[0]);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to submit review');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <div className="review-modal-header">
          <h3>Review Recipe</h3>
          <button
            onClick={onClose}
            className="review-modal-close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-modal-form">
          <div className="review-recipe-info">
            <h4>{recipeTitle}</h4>
            <p>Share your thoughts about this recipe</p>
          </div>

          {/* Rating */}
          <div className="email-modal-field">
            <label className="email-modal-label">
              Rating *
            </label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={`star-button ${
                    star <= rating ? 'star-filled' : 'star-empty'
                  }`}
                >
                  <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="star-rating-text">
                {rating} star{rating !== 1 ? 's' : ''} out of 5
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="email-modal-field">
            <label className="email-modal-label">
              Your Review *
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience with this recipe..."
              className="email-modal-textarea"
              rows={4}
              maxLength={1000}
            />
            <p className="email-modal-char-count">
              {reviewText.length}/1000 characters
            </p>
          </div>

          {/* Review Date */}
          <div className="email-modal-field">
            <label className="email-modal-label">
              <Calendar size={16} className="inline mr-1" />
              Review Date
            </label>
            <input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="email-modal-input"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="email-modal-error">
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="review-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="email-modal-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reviewText.trim() || rating === 0}
              className="email-modal-submit"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="email-modal-spinner"></div>
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send size={16} className="mr-2" />
                  Submit Review
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
