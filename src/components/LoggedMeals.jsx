import React from 'react';
import { Clock, ChefHat, UtensilsCrossed, Calendar } from 'lucide-react';

const LoggedMeals = ({ loggedMeals, userEmail }) => {
  if (!loggedMeals || loggedMeals.length === 0) {
    return (
      <div className="logged-meals-section">
        <div className="logged-meals-header">
          <h3>Logged Meals</h3>
          <p>Meals you've logged will appear here</p>
        </div>
        <div className="no-logged-meals">
          <div className="no-meals-icon">🍽️</div>
          <p>No meals logged yet</p>
          <small>Log a meal to track your cooking journey!</small>
        </div>
      </div>
    );
  }

  return (
    <div className="logged-meals-section">
      <div className="logged-meals-header">
        <h3>Your Logged Meals</h3>
        <p>Track your cooking journey with {userEmail}</p>
      </div>
      
      <div className="logged-meals-list">
        {loggedMeals.map((meal, index) => (
          <div key={index} className="logged-meal-card">
            <div className="meal-header">
              <div className="meal-title">
                <ChefHat size={16} />
                <span>{meal.recipeTitle}</span>
              </div>
              <div className="meal-date">
                <Calendar size={14} />
                <span>{new Date(meal.loggedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="meal-details">
              <div className="meal-ingredients">
                <UtensilsCrossed size={14} />
                <span>{meal.ingredients}</span>
              </div>
              <div className="meal-time">
                <Clock size={14} />
                <span>{meal.cookingTime}</span>
              </div>
            </div>
            
            <div className="meal-preview">
              {meal.content.substring(0, 120)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoggedMeals;
