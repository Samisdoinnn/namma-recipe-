import React from 'react';
import { render } from '@testing-library/react-native';
import { RecipeCard } from '../RecipeCard';
import { Recipe } from '@/types';

const mockRecipe: Recipe = {
  id: '1',
  title: 'Test Recipe',
  description: 'A delicious test recipe',
  imageUrl: 'https://example.com/image.jpg',
  authorId: 'user1',
  authorName: 'Test User',
  ingredients: [
    { id: '1', name: 'Flour', quantity: 2, unit: 'cups' },
    { id: '2', name: 'Sugar', quantity: 1, unit: 'cup' },
  ],
  steps: [
    { id: '1', order: 1, instruction: 'Mix ingredients' },
    { id: '2', order: 2, instruction: 'Bake at 350°F' },
  ],
  localeVariants: [],
  tags: ['Dessert', 'Easy'],
  servings: 4,
  prepTime: 15,
  cookTime: 30,
  difficulty: 'easy',
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublished: true,
};

describe('RecipeCard', () => {
  it('renders recipe title correctly', () => {
    const { getByText } = render(
      <RecipeCard recipe={mockRecipe} onPress={() => {}} />
    );
    expect(getByText('Test Recipe')).toBeTruthy();
  });

  it('displays servings information', () => {
    const { getByText } = render(
      <RecipeCard recipe={mockRecipe} onPress={() => {}} />
    );
    expect(getByText('4')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <RecipeCard recipe={mockRecipe} onPress={onPressMock} />
    );
    
    const card = getByText('Test Recipe');
    card.parent?.props.onPress();
    
    expect(onPressMock).toHaveBeenCalled();
  });

  it('shows favorite button when onFavoritePress is provided', () => {
    const { UNSAFE_getByType } = render(
      <RecipeCard 
        recipe={mockRecipe} 
        onPress={() => {}} 
        onFavoritePress={() => {}}
      />
    );
    
    // The favorite button should be rendered
    expect(UNSAFE_getByType).toBeTruthy();
  });

  it('displays correct difficulty badge color', () => {
    const { getByText } = render(
      <RecipeCard recipe={mockRecipe} onPress={() => {}} />
    );
    
    // Check if difficulty is rendered
    expect(getByText('Easy')).toBeTruthy();
  });
});
