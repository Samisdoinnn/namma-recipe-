import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '@/types';

interface RecipeState {
  recipes: Recipe[];
  favoriteRecipes: Recipe[];
  currentRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  recipes: [],
  favoriteRecipes: [],
  currentRecipe: null,
  isLoading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setFavoriteRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.favoriteRecipes = action.payload;
    },
    setCurrentRecipe: (state, action: PayloadAction<Recipe | null>) => {
      state.currentRecipe = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.unshift(action.payload);
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(r => r.id === action.payload.id);
      if (index > -1) {
        state.recipes[index] = action.payload;
      }
      if (state.currentRecipe?.id === action.payload.id) {
        state.currentRecipe = action.payload;
      }
    },
    removeRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(r => r.id !== action.payload);
      state.favoriteRecipes = state.favoriteRecipes.filter(r => r.id !== action.payload);
      if (state.currentRecipe?.id === action.payload) {
        state.currentRecipe = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  setRecipes,
  setFavoriteRecipes,
  setCurrentRecipe,
  addRecipe,
  updateRecipe,
  removeRecipe,
  setLoading,
  setError,
  clearError,
} = recipeSlice.actions;

export default recipeSlice.reducer;
