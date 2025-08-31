import { useState } from 'react'
import { ChefHat, Clock, Target, UtensilsCrossed } from 'lucide-react'

const MEAL = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"]
const CUISINE = ["ITALIAN", "MEXICAN", "CHINESE", "INDIAN", "AMERICAN", "FRENCH", "THAI", "JAPANESE", "MEDITERRANEAN", "OTHER"]
const TIME = ["UNDER_30", "MIN_30_60", "OVER_60"]
const LEVEL = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]

export default function RecipeForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    ingredients: "tomato, potato, onion",
    mealType: "LUNCH",
    cuisine: "ITALIAN",
    cookingTime: "MIN_30_60",
    complexity: "BEGINNER"
  })

  const handleChange = e => setForm(prev => ({...prev, [e.target.name]: e.target.value}))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  const clearForm = () => {
    setForm({
      ingredients: "",
      mealType: "LUNCH",
      cuisine: "ITALIAN",
      cookingTime: "MIN_30_60",
      complexity: "BEGINNER"
    })
  }

  return (
    <form onSubmit={handleSubmit} className="recipe-form">
      <h2>Recipe Preferences</h2>
      
      <div className="form-group">
        <label htmlFor="ingredients">
          <UtensilsCrossed size={16} />
          Ingredients
        </label>
        <input 
          id="ingredients"
          name="ingredients" 
          value={form.ingredients} 
          onChange={handleChange} 
          placeholder="e.g. chicken, rice, carrots, spinach"
          required
        />
        <small>Separate ingredients with commas</small>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="mealType">
            <ChefHat size={16} />
            Meal Type
          </label>
          <select id="mealType" name="mealType" value={form.mealType} onChange={handleChange}>
            {MEAL.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="cuisine">
            <Target size={16} />
            Cuisine
          </label>
          <select id="cuisine" name="cuisine" value={form.cuisine} onChange={handleChange}>
            {CUISINE.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cookingTime">
            <Clock size={16} />
            Cooking Time
          </label>
          <select id="cookingTime" name="cookingTime" value={form.cookingTime} onChange={handleChange}>
            {TIME.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="complexity">
            <Target size={16} />
            Complexity
          </label>
          <select id="complexity" name="complexity" value={form.complexity} onChange={handleChange}>
            {LEVEL.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          disabled={loading} 
          className="generate-btn"
        >
          {loading ? '🍳 Generating Recipe...' : '✨ Generate Recipe'}
        </button>
        
        <button 
          type="button" 
          onClick={clearForm} 
          className="clear-btn"
          disabled={loading}
        >
          Clear Form
        </button>
      </div>
    </form>
  )
}
