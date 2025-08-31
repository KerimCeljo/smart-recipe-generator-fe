import { Copy, Download, Share2, Trash2, Mail } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'
import { config } from '../config'

export default function RecipeDisplay({ recipe, loading, error, onDelete, currentRecipeId }) {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailMessage, setEmailMessage] = useState('')

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
        recipeTitle: 'Your Generated Recipe'
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
    </div>
  )
}
