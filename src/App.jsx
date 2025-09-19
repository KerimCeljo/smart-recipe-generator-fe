import { useState, useEffect } from 'react'
import axios from 'axios'
import { config } from './config.js'
import RecipeForm from './components/RecipeForm'
import RecipeDisplay from './components/RecipeDisplay'
import RecipeHistory from './components/RecipeHistory'
import LoginModal from './components/LoginModal'
import LoggedMeals from './components/LoggedMeals'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentRecipe, setCurrentRecipe] = useState('')
  const [recipeHistory, setRecipeHistory] = useState([])
  const [userRecipes, setUserRecipes] = useState([])
  const [userRequests, setUserRequests] = useState([])
  const [showLoginModal, setShowLoginModal] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [loggedMeals, setLoggedMeals] = useState([])
  const [showLogSuccess, setShowLogSuccess] = useState(false)

  // Load user's recipe history on component mount
  useEffect(() => {
    if (userEmail) {
      loadUserData()
    }
  }, [userEmail])

  // Load logged meals from localStorage on component mount
  useEffect(() => {
    const savedLoggedMeals = localStorage.getItem('loggedMeals')
    if (savedLoggedMeals) {
      setLoggedMeals(JSON.parse(savedLoggedMeals))
    }
  }, [])

  const handleLogin = (email) => {
    setUserEmail(email)
    setShowLoginModal(false)
  }

  const handleLogMeal = (recipe) => {
    const newLoggedMeal = {
      recipeTitle: extractRecipeTitle(recipe.content),
      ingredients: recipe.form.ingredients,
      cookingTime: recipe.form.cookingTime,
      content: recipe.content,
      loggedAt: new Date().toISOString(),
      userEmail: userEmail
    }

    const updatedLoggedMeals = [newLoggedMeal, ...loggedMeals]
    setLoggedMeals(updatedLoggedMeals)
    
    // Save to localStorage
    localStorage.setItem('loggedMeals', JSON.stringify(updatedLoggedMeals))
    
    // Show success notification
    setShowLogSuccess(true)
    setTimeout(() => {
      setShowLogSuccess(false)
    }, 3000)
  }

  const extractRecipeTitle = (content) => {
    if (!content || content.isEmpty) {
      return 'Untitled Recipe'
    }
    
    const lines = content.split('\n')
    if (lines.length > 0) {
      const firstLine = lines[0].trim()
      return firstLine.replaceAll('🍳\\s*', '').replaceAll('\\s+RECIPE$', '')
    }
    
    return 'Untitled Recipe'
  }

  const loadUserData = async () => {
    try {
      // Load user's recipes and requests in parallel
      const [recipesResponse, requestsResponse] = await Promise.all([
        axios.get(`${config.API_BASE}/api/recipes/user/${config.DEMO_USER_ID}`),
        axios.get(`${config.API_BASE}/api/recipes/user/${config.DEMO_USER_ID}/requests`)
      ])
      
      const recipes = recipesResponse.data
      const requests = requestsResponse.data
      
      // Set the state first
      setUserRecipes(recipes)
      setUserRequests(requests)
      
      console.log('Loaded recipes:', recipes)
      console.log('Loaded requests:', requests)
      
      // Update recipe history with the latest data
      const historyData = recipes.map(recipe => {
        const request = requests.find(req => req.id === recipe.requestId)
        console.log(`Recipe ${recipe.id} has requestId ${recipe.requestId}, found request:`, request)
        
        return {
          id: recipe.id,
          content: recipe.content,
          timestamp: new Date(recipe.createdAt).toLocaleString(),
          form: {
            ingredients: request?.ingredients || 'No ingredients data',
            mealType: request?.mealType || 'No meal type data',
            cuisine: request?.cuisine || 'No cuisine data',
            cookingTime: request?.cookingTime || 'No cooking time data',
            complexity: request?.complexity || 'No complexity data'
          }
        }
      })
      
      console.log('Created history data:', historyData)
      setRecipeHistory(historyData)
    } catch (err) {
      console.error('Error loading user data:', err)
      setError('Failed to load recipe history')
    }
  }

  const generateRecipe = async (formData) => {
    setLoading(true)
    setError('')
    setCurrentRecipe('')

    try {
      const response = await axios.post(`${config.API_BASE}/api/recipes/generate`, formData, {
        headers: { "X-USER-ID": config.DEMO_USER_ID }
      })

      if (response.data.status === 'success') {
        setCurrentRecipe(response.data.content)
        // Reload user data to get the new recipe
        await loadUserData()
      } else {
        setError(response.data.message || 'Failed to generate recipe')
      }
    } catch (err) {
      console.error('Error generating recipe:', err)
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Failed to connect to backend. Please check if your Spring Boot app is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadRecipeFromHistory = (recipe) => {
    setCurrentRecipe(recipe.content)
  }

  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`${config.API_BASE}/api/recipes/${recipeId}`)
      // Reload user data after deletion
      await loadUserData()
    } catch (err) {
      console.error('Error deleting recipe:', err)
      setError('Failed to delete recipe')
    }
  }

  const searchRecipes = async (ingredient) => {
    try {
      const response = await axios.get(`${config.API_BASE}/api/recipes/user/${config.DEMO_USER_ID}/search`, {
        params: { ingredient }
      })
      console.log('Search response:', response.data)
      console.log('Current userRequests:', userRequests)
      
      // Transform backend data to match recipeHistory format
      const searchResults = response.data.map(recipe => {
        const request = userRequests.find(req => req.id === recipe.requestId)
        console.log(`Recipe ${recipe.id} has requestId ${recipe.requestId}, found request:`, request)
        
        return {
          id: recipe.id,
          content: recipe.content,
          timestamp: new Date(recipe.createdAt).toLocaleString(),
          form: {
            ingredients: request?.ingredients || 'No ingredients data',
            mealType: request?.mealType || 'No meal type data',
            cuisine: request?.cuisine || 'No cuisine data',
            cookingTime: request?.cookingTime || 'No cooking time data',
            complexity: request?.complexity || 'No complexity data'
          }
        }
      })
      return searchResults
    } catch (err) {
      console.error('Error searching recipes:', err)
      return []
    }
  }

  const filterRecipesByMealType = async (mealType) => {
    try {
      const response = await axios.get(`${config.API_BASE}/api/recipes/user/${config.DEMO_USER_ID}/meal-type/${mealType}`)
      // Transform backend data to match recipeHistory format
      const filteredRecipes = response.data.map(recipe => {
        const request = userRequests.find(req => req.id === recipe.requestId)
        return {
          id: recipe.id,
          content: recipe.content,
          timestamp: new Date(recipe.createdAt).toLocaleString(),
          form: {
            ingredients: request?.ingredients || 'No ingredients data',
            mealType: request?.mealType || 'No meal type data',
            cuisine: request?.cuisine || 'No cuisine data',
            cookingTime: request?.cookingTime || 'No cooking time data',
            complexity: request?.complexity || 'No complexity data'
          }
        }
      })
      return filteredRecipes
    } catch (err) {
      console.error('Error filtering recipes by meal type:', err)
      return []
    }
  }

  const filterRecipesByCuisine = async (cuisine) => {
    try {
      const response = await axios.get(`${config.API_BASE}/api/recipes/user/${config.DEMO_USER_ID}/cuisine/${cuisine}`)
      // Transform backend data to match recipeHistory format
      const filteredRecipes = response.data.map(recipe => {
        const request = userRequests.find(req => req.id === recipe.requestId)
        return {
          id: recipe.id,
          content: recipe.content,
          timestamp: new Date(recipe.createdAt).toLocaleString(),
          form: {
            ingredients: request?.ingredients || 'No ingredients data',
            mealType: request?.mealType || 'No meal type data',
            cuisine: request?.cuisine || 'No cuisine data',
            cookingTime: request?.cookingTime || 'No cooking time data',
            complexity: request?.complexity || 'No complexity data'
          }
        }
      })
      return filteredRecipes
    } catch (err) {
      console.error('Error filtering recipes by cuisine:', err)
      return []
    }
  }

  const filterRecipesByComplexity = async (complexity) => {
    try {
      const response = await axios.get(`${config.API_BASE}/api/recipes/user/${config.DEMO_USER_ID}/complexity/${complexity}`)
      // Transform backend data to match recipeHistory format
      const filteredRecipes = response.data.map(recipe => {
        const request = userRequests.find(req => req.id === recipe.requestId)
        return {
          id: recipe.id,
          content: recipe.content,
          timestamp: new Date(recipe.createdAt).toLocaleString(),
          form: {
            ingredients: request?.ingredients || 'No ingredients data',
            mealType: request?.mealType || 'No meal type data',
            cuisine: request?.cuisine || 'No cuisine data',
            cookingTime: request?.cookingTime || 'No cooking time data',
            complexity: request?.complexity || 'No complexity data'
          }
        }
      })
      return filteredRecipes
    } catch (err) {
      console.error('Error filtering recipes by complexity:', err)
      return []
    }
  }

  const filterRecipesByCookingTime = async (cookingTime) => {
    try {
      const response = await axios.get(`${config.API_BASE}/api/recipes/user/${config.DEMO_USER_ID}/cooking-time/${cookingTime}`)
      // Transform backend data to match recipeHistory format
      const filteredRecipes = response.data.map(recipe => {
        const request = userRequests.find(req => req.id === recipe.requestId)
        return {
          id: recipe.id,
          content: recipe.content,
          timestamp: new Date(recipe.createdAt).toLocaleString(),
          form: {
            ingredients: request?.ingredients || 'No ingredients data',
            mealType: request?.mealType || 'No meal type data',
            cuisine: request?.cuisine || 'No cuisine data',
            cookingTime: request?.cookingTime || 'No cooking time data',
            complexity: request?.complexity || 'No complexity data'
          }
        }
      })
      return filteredRecipes
    } catch (err) {
      console.error('Error filtering recipes by cooking time:', err)
      return []
    }
  }

  return (
    <div className="app-container">
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onLogin={handleLogin} 
      />

      {/* Success Notification */}
      {showLogSuccess && (
        <div className="log-success-notification">
          <div className="log-success-icon">✓</div>
          <span>You successfully logged that meal!</span>
        </div>
      )}

      <header className="app-header">
        <h1>🍳 Smart Recipe Generator</h1>
        {userEmail && (
          <div className="user-info">
            <span>Welcome, {userEmail}</span>
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="form-container">
          <RecipeForm onSubmit={generateRecipe} loading={loading} />
        </div>

        <div className="results-container">
          <RecipeDisplay 
            recipe={currentRecipe} 
            loading={loading} 
            error={error}
            onDelete={deleteRecipe}
            currentRecipeId={recipeHistory.find(r => r.content === currentRecipe)?.id}
            recipeTitle={extractRecipeTitle(currentRecipe)}
          />
        </div>

        <div className="history-section">
          <RecipeHistory 
            recipes={recipeHistory} 
            onLoadRecipe={loadRecipeFromHistory}
            onDeleteRecipe={deleteRecipe}
            searchRecipes={searchRecipes}
            filterByMealType={filterRecipesByMealType}
            filterByCuisine={filterRecipesByCuisine}
            filterByComplexity={filterRecipesByComplexity}
            filterByCookingTime={filterRecipesByCookingTime}
            userEmail={userEmail}
            onLogMeal={handleLogMeal}
          />
        </div>

        {/* Logged Meals Section */}
        {userEmail && (
          <LoggedMeals 
            loggedMeals={loggedMeals} 
            userEmail={userEmail} 
          />
        )}
      </main>
    </div>
  )
}
