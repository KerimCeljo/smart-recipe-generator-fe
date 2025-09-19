import React, { useState } from 'react';
import { X, Mail, User } from 'lucide-react';

const LoginModal = ({ isOpen, onLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onLogin callback with the email
      onLogin(email.trim());
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <div className="login-icon">
            <User size={32} />
          </div>
          <h2>Welcome to Smart Recipe Generator</h2>
          <p>Please enter your email to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-modal-form">
          <div className="login-field">
            <label className="login-label">
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="login-input"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {error && (
            <div className="login-error">
              <p>{error}</p>
            </div>
          )}

          <div className="login-actions">
            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="login-submit"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="login-spinner"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  Sign In
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
