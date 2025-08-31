import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RecipeDisplay from '../RecipeDisplay'

describe('RecipeDisplay', () => {
  const mockRecipe = 'Delicious tomato soup recipe with fresh ingredients'

  it('renders recipe content when recipe is provided', () => {
    render(<RecipeDisplay recipe={mockRecipe} />)
    
    expect(screen.getByText('Delicious tomato soup recipe with fresh ingredients')).toBeInTheDocument()
  })

  it('renders loading state when no recipe', () => {
    render(<RecipeDisplay recipe={null} />)
    
    // Check for the specific "no recipe" message
    expect(screen.getByText('👨‍🍳 No recipe generated yet')).toBeInTheDocument()
  })

  it('shows recipe actions when recipe exists', () => {
    render(<RecipeDisplay recipe={mockRecipe} />)
    
    // Check if copy button is present
    expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument()
  })
})
