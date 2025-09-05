import { Copy, Download, Share2, Trash2, Mail, Star, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import { config } from '../config'
import ReviewModal from './ReviewModal'
import ReviewEmailModal from './ReviewEmailModal'

export default function RecipeDisplay({ recipe, loading, error, onDelete, currentRecipeId, recipeTitle = 'Generated Recipe' }) {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showReviewEmailModal, setShowReviewEmailModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsCollapsed, setReviewsCollapsed] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(recipe)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy recipe:', err)
    }
  }

  const downloadRecipe = () => {
    const element = document.createElement('a')
    const file = new Blob([recipe], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'recipe.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleDelete = () => {
    if (currentRecipeId && onDelete) {
      if (confirm('Are you sure you want to delete this recipe?')) {
        onDelete(currentRecipeId)
      }
    }
  }

  const sendEmail = async () => {
    if (!email.trim()) {
      setEmailMessage('Please enter an email address')
      return
    }

    setEmailLoading(true)
    setEmailMessage('')

    try {
      const response = await axios.post(`${config.API_BASE}/api/recipes/send-email`, {
        email: email.trim(),
        recipeContent: recipe,
        recipeTitle: recipeTitle
      })

      setEmailMessage('✅ Recipe sent successfully!')
      setEmail('')
      setTimeout(() => {
        setShowEmailModal(false)
        setEmailMessage('')
      }, 2000)
    } catch (err) {
      console.error('Error sending email:', err)
      setEmailMessage('❌ Failed to send email. Please try again.')
    } finally {
      setEmailLoading(false)
    }
  }

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev])
    setShowReviewModal(false)
  }

  const loadReviews = async () => {
    if (!currentRecipeId) return
    
    setReviewsLoading(true)
    try {
      const response = await axios.get(`${config.API_BASE}/api/recipes/${currentRecipeId}/reviews`)
      setReviews(response.data)
    } catch (err) {
      console.error('Error loading reviews:', err)
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleReviewEmail = (review) => {
    setSelectedReview(review)
    setShowReviewEmailModal(true)
  }

  if (loading) {
    return (
      <div className="results-container">
        <h3>Generating Recipe...</h3>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>🍳 Creating your perfect recipe...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="results-container">
        <h3>Error</h3>
        <div className="error-message">
          <p>❌ {error}</p>
          <p>Please try again or check your connection.</p>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="results-container">
        <h3>Generated Recipe</h3>
        <div className="placeholder">
          <p>👨‍🍳 No recipe generated yet</p>
          <p>Fill in your preferences and click "Generate Recipe" to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="results-container">
      <div className="recipe-header">
        <h3>Generated Recipe</h3>
        <div className="recipe-actions">
          <button onClick={copyToClipboard} className="action-btn" title="Copy to clipboard">
            <Copy size={16} />
          </button>
          <button onClick={downloadRecipe} className="action-btn" title="Download recipe">
            <Download size={16} />
          </button>
          <button onClick={() => setShowEmailModal(true)} className="action-btn" title="Send via email">
            <Mail size={16} />
          </button>
          {currentRecipeId && (
            <button 
              onClick={() => setShowReviewModal(true)} 
              className="action-btn" 
              title="Review this recipe"
              style={{ color: '#f59e0b' }}
            >
              <Star size={16} />
            </button>
          )}
          {currentRecipeId && (
            <button 
              onClick={handleDelete} 
              className="action-btn delete-btn" 
              title="Delete recipe"
              style={{ color: '#dc3545' }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="recipe-content">
        {recipe}
      </div>

      {/* Reviews Section */}
      {currentRecipeId && (
        <div className="reviews-section">
          <div className="reviews-header">
            <div className="reviews-title-section">
              <h4>Reviews</h4>
              {reviews.length > 0 && (
                <button 
                  onClick={() => setReviewsCollapsed(!reviewsCollapsed)}
                  className="collapse-btn"
                  title={reviewsCollapsed ? 'Expand reviews' : 'Collapse reviews'}
                >
                  {reviewsCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
              )}
            </div>
            <button 
              onClick={loadReviews} 
              className="load-reviews-btn"
              disabled={reviewsLoading}
            >
              {reviewsLoading ? 'Loading...' : 'Load Reviews'}
            </button>
          </div>
          
          {!reviewsCollapsed && (
            <>
              {reviews.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={`star ${star <= review.rating ? 'filled' : 'empty'}`}
                              fill={star <= review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                          <span className="rating-text">{review.rating}/5</span>
                        </div>
                        <div className="review-actions">
                          <button 
                            onClick={() => handleReviewEmail(review)}
                            className="review-email-btn"
                            title="Send review via email"
                          >
                            <Mail size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="review-text">{review.reviewText}</p>
                      <div className="review-meta">
                        <span className="review-date">
                          {new Date(review.reviewDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-reviews-message">
                  <div className="no-reviews-icon">⭐</div>
                  <h4>No reviews yet</h4>
                  <p>Be the first to review this recipe!</p>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="add-review-btn"
                  >
                    <MessageSquare size={16} />
                    Add Review
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="email-modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="email-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📧 Send Recipe via Email</h3>
            <div className="email-form">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
                disabled={emailLoading}
              />
              <div className="email-actions">
                <button 
                  onClick={sendEmail} 
                  className="email-send-btn"
                  disabled={emailLoading}
                >
                  {emailLoading ? 'Sending...' : 'Send Recipe'}
                </button>
                <button 
                  onClick={() => setShowEmailModal(false)} 
                  className="email-cancel-btn"
                  disabled={emailLoading}
                >
                  Cancel
                </button>
              </div>
              {emailMessage && (
                <div className="email-message">
                  {emailMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        recipeId={currentRecipeId}
        recipeTitle={recipeTitle}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Review Email Modal */}
      <ReviewEmailModal
        isOpen={showReviewEmailModal}
        onClose={() => setShowReviewEmailModal(false)}
        review={selectedReview}
        recipeTitle={recipeTitle}
      />
    </div>
  )
}
