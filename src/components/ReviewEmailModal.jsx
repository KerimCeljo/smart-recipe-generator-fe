import React, { useState } from 'react';
import { X, Mail, Send, Star } from 'lucide-react';

const ReviewEmailModal = ({ isOpen, onClose, review, recipeTitle }) => {
  const [email, setEmail] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const emailData = {
        email: email.trim(),
        reviewContent: review.reviewText,
        recipeTitle: recipeTitle,
        reviewerName: reviewerName.trim() || 'Anonymous',
        rating: review.rating
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/recipes/reviews/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        setSuccess('Review sent successfully!');
        setTimeout(() => {
          onClose();
          setEmail('');
          setReviewerName('');
          setSuccess('');
        }, 2000);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to send review');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error sending review email:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !review) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <div className="review-modal-header email-header">
          <h3>Send Review via Email</h3>
          <button
            onClick={onClose}
            className="review-modal-close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-modal-form">
          {/* Review Preview */}
          <div className="review-recipe-info">
            <h4>{recipeTitle}</h4>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${
                    star <= review.rating ? 'star-filled' : 'star-empty'
                  }`}
                >
                  <Star
                    size={20}
                    fill={star <= review.rating ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
            <p className="star-rating-text">
              {review.rating}/5 stars
            </p>
            <div className="review-preview-text">
              <p>"{review.reviewText}"</p>
            </div>
          </div>

          {/* Email Input */}
          <div className="email-modal-field">
            <label className="email-modal-label">
              <Mail size={16} />
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              className="email-modal-input"
              required
            />
          </div>

          {/* Reviewer Name */}
          <div className="email-modal-field">
            <label className="email-modal-label">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Your name"
              className="email-modal-input"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="email-modal-error">
              <p>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="email-modal-success">
              <p>{success}</p>
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
              disabled={isSubmitting || !email.trim()}
              className="email-modal-submit"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="email-modal-spinner"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center">
                  <Send size={16} className="mr-2" />
                  Send Review
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewEmailModal;
