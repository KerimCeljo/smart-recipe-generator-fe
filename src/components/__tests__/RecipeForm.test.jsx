import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RecipeForm from '../RecipeForm'

describe('RecipeForm', () => {
  const mockOnSubmit = vi.fn()
  
  it('renders recipe form with all fields', () => {
    render(<RecipeForm onSubmit={mockOnSubmit} loading={false} />)
    
    // Check if form fields are rendered
    expect(screen.getByLabelText(/ingredients/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/meal type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cuisine/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cooking time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/complexity/i)).toBeInTheDocument()
  })

  it('allows user to input ingredients', () => {
    render(<RecipeForm onSubmit={mockOnSubmit} loading={false} />)
    
    const ingredientsInput = screen.getByLabelText(/ingredients/i)
    fireEvent.change(ingredientsInput, { target: { value: 'tomato, potato, onion' } })
    
    expect(ingredientsInput.value).toBe('tomato, potato, onion')
  })

  it('allows user to select meal type', () => {
    render(<RecipeForm onSubmit={mockOnSubmit} loading={false} />)
    
    const mealTypeSelect = screen.getByLabelText(/meal type/i)
    fireEvent.change(mealTypeSelect, { target: { value: 'BREAKFAST' } })
    
    expect(mealTypeSelect.value).toBe('BREAKFAST')
  })

  it('calls onSubmit when form is submitted', () => {
    render(<RecipeForm onSubmit={mockOnSubmit} loading={false} />)
    
    const submitButton = screen.getByText('✨ Generate Recipe')
    fireEvent.click(submitButton)
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      ingredients: "tomato, potato, onion",
      mealType: "LUNCH",
      cuisine: "ITALIAN",
      cookingTime: "MIN_30_60",
      complexity: "BEGINNER"
    })
  })
})
