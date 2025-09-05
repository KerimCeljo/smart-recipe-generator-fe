import { useState, useEffect } from 'react'
import { Clock, ChefHat, Target, UtensilsCrossed, Trash2, Search, Filter, Star, MessageSquare } from 'lucide-react'
import axios from 'axios'
import { config } from '../config'

export default function RecipeHistory({ 
  recipes, 
  onLoadRecipe, 
  onDeleteRecipe,
  searchRecipes,
  filterByMealType,
  filterByCuisine,
  filterByComplexity,
  filterByCookingTime
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredRecipes, setFilteredRecipes] = useState(recipes)
  const [activeFilter, setActiveFilter] = useState('all')
  const [reviewCounts, setReviewCounts] = useState({})
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [loadingRecipeId, setLoadingRecipeId] = useState(null)
  const [loadSuccess, setLoadSuccess] = useState(false)

  // Update filtered recipes when recipes change
  useEffect(() => {
    setFilteredRecipes(recipes)
  }, [recipes])

  // Fetch review counts for all recipes
  useEffect(() => {
    if (recipes && recipes.length > 0) {
      fetchReviewCounts()
    }
  }, [recipes])

  const fetchReviewCounts = async () => {
    setLoadingReviews(true)
    try {
      const counts = {}
      for (const recipe of recipes) {
        try {
          const response = await axios.get(`${config.API_BASE}/api/recipes/${recipe.id}/stats`)
          counts[recipe.id] = response.data.reviewCount || 0
        } catch (error) {
          console.error(`Failed to fetch review count for recipe ${recipe.id}:`, error)
          counts[recipe.id] = 0
        }
      }
      setReviewCounts(counts)
    } catch (error) {
      console.error('Failed to fetch review counts:', error)
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleLoadRecipe = async (recipe) => {
    setLoadingRecipeId(recipe.id)
    setLoadSuccess(false)
    
    try {
      await onLoadRecipe(recipe)
      setLoadSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setLoadSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error loading recipe:', error)
    } finally {
      setLoadingRecipeId(null)
    }
  }

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const results = await searchRecipes(searchTerm)
        if (results && results.length > 0) {
          setFilteredRecipes(results)
          setActiveFilter('search')
        } else {
          setFilteredRecipes([])
          setActiveFilter('search')
        }
      } catch (error) {
        console.error('Search failed:', error)
        setFilteredRecipes(recipes)
        setActiveFilter('all')
        alert(`Search failed: ${error.message}. Showing all recipes.`)
      }
    } else {
      setFilteredRecipes(recipes)
      setActiveFilter('all')
    }
  }

  const handleFilter = async (filterType, value) => {
    console.log(`Filtering by ${filterType}: ${value}`)
    let results = []
    
    try {
      switch (filterType) {
        case 'mealType':
          console.log('Calling filterByMealType...')
          results = await filterByMealType(value)
          console.log('filterByMealType results:', results)
          break
        case 'cuisine':
          console.log('Calling filterByCuisine...')
          results = await filterByCuisine(value)
          console.log('filterByCuisine results:', results)
          break
        case 'complexity':
          console.log('Calling filterByComplexity...')
          results = await filterByComplexity(value)
          console.log('filterByComplexity results:', results)
          break
        case 'cookingTime':
          console.log('Calling filterByCookingTime...')
          results = await filterByCookingTime(value)
          console.log('filterByCookingTime results:', results)
          break
        case 'all':
        default:
          console.log('Showing all recipes')
          results = recipes
          break
      }
      
      // Validate results and ensure they're in the correct format
      if (!results) {
        console.log('Filter returned null/undefined, showing all recipes')
        results = recipes
      } else if (!Array.isArray(results)) {
        console.log('Filter returned non-array, converting to array')
        results = Array.isArray(results) ? results : [results]
      } else if (results.length === 0) {
        console.log(`No results found for ${filterType}: ${value}, showing all recipes`)
        results = recipes
      }
      
      // Ensure each result has the required structure
      const validResults = results.filter(recipe => 
        recipe && recipe.id && recipe.content && recipe.form
      )
      
      if (validResults.length === 0) {
        console.log('No valid results found, showing all recipes')
        results = recipes
      } else {
        results = validResults
      }
      
      console.log('Final filtered recipes:', results)
      setFilteredRecipes(results)
      // Set active filter to include both type and value for proper button highlighting
      setActiveFilter(`${filterType}-${value}`)
      
    } catch (error) {
      console.error(`Error filtering by ${filterType}:`, error)
      // Fall back to showing all recipes on error
      setFilteredRecipes(recipes)
      setActiveFilter('all')
      alert(`Filter failed: ${error.message}. Showing all recipes.`)
    }
  }

  const clearFilters = () => {
    setFilteredRecipes(recipes)
    setActiveFilter('all')
    setSearchTerm('')
  }

  // Ensure filteredRecipes is always valid
  const safeFilteredRecipes = filteredRecipes && Array.isArray(filteredRecipes) ? filteredRecipes : recipes

  if (recipes.length === 0) {
    return (
      <div className="history-section">
        <div className="history-header">
          <h2>Recent Recipes</h2>
          <p>No recipes generated yet. Create your first recipe to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="history-section">
      {/* Success Notification */}
      {loadSuccess && (
        <div className="load-success-notification">
          <div className="success-icon">✓</div>
          <span>Recipe loaded successfully!</span>
        </div>
      )}
      
      <div className="history-header">
        <h2>Recent Recipes</h2>
        <p>Search and filter through your recipe collection</p>
      </div>
      
      <div className="search-filters">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            <Search size={18} />
          </button>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <h3>Filter Recipes</h3>
          <div className="filter-buttons">
            <button 
              onClick={() => handleFilter('all')} 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button 
              onClick={() => handleFilter('mealType', 'BREAKFAST')} 
              className={`filter-btn ${activeFilter === 'mealType-BREAKFAST' ? 'active' : ''}`}
            >
              Breakfast
            </button>
            <button 
              onClick={() => handleFilter('mealType', 'LUNCH')} 
              className={`filter-btn ${activeFilter === 'mealType-LUNCH' ? 'active' : ''}`}
            >
              Lunch
            </button>
            <button 
              onClick={() => handleFilter('mealType', 'DINNER')} 
              className={`filter-btn ${activeFilter === 'mealType-DINNER' ? 'active' : ''}`}
            >
              Dinner
            </button>
            <button 
              onClick={() => handleFilter('cuisine', 'ITALIAN')} 
              className={`filter-btn ${activeFilter === 'cuisine-ITALIAN' ? 'active' : ''}`}
            >
              Italian
            </button>
            <button 
              onClick={() => handleFilter('cuisine', 'MEXICAN')} 
              className={`filter-btn ${activeFilter === 'cuisine-MEXICAN' ? 'active' : ''}`}
            >
              Mexican
            </button>
          </div>
          <button 
            onClick={clearFilters} 
            className="clear-filters"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="history-grid">
        {safeFilteredRecipes.map(recipe => (
          <div key={recipe.id} className="history-card">
            <div className="history-header">
              <span className="history-time">
                <Clock size={14} />
                {recipe.timestamp}
              </span>
              <span className="history-meal">
                <ChefHat size={14} />
                {recipe.form.mealType}
              </span>
              {reviewCounts[recipe.id] > 0 && (
                <div className="review-badge">
                  <Star size={10} />
                  <span>{reviewCounts[recipe.id]} review{reviewCounts[recipe.id] !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            <div className="history-ingredients">
              <UtensilsCrossed size={14} />
              {recipe.form.ingredients.split(',').slice(0, 3).join(', ')}
              {recipe.form.ingredients.split(',').length > 3 && '...'}
            </div>

            <div className="history-details">
              <span className="history-cuisine">
                <Target size={12} />
                {recipe.form.cuisine}
              </span>
              <span className="history-time-range">
                <Clock size={12} />
                {recipe.form.cookingTime}
              </span>
              <span className="history-level">
                <Target size={12} />
                {recipe.form.complexity}
              </span>
            </div>

            <div className="history-preview">
              {recipe.content.substring(0, 100)}...
            </div>

            <div className="history-actions">
              <button 
                onClick={() => handleLoadRecipe(recipe)} 
                className="load-btn"
                title="Load recipe"
                disabled={loadingRecipeId === recipe.id}
              >
                {loadingRecipeId === recipe.id ? 'Loading...' : 'Load'}
              </button>
              <button 
                onClick={() => onDeleteRecipe(recipe.id)} 
                className="delete-btn"
                title="Delete recipe"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {safeFilteredRecipes.length === 0 && (
        <div className="no-results">
          <p>No recipes found matching your criteria.</p>
          <button onClick={clearFilters} className="clear-filter-btn">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
