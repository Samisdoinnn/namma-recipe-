import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import recipeReducer from './slices/recipeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipe: recipeReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date fields in actions
        ignoredActions: ['auth/setUser', 'recipe/setRecipes', 'recipe/setCurrentRecipe'],
        ignoredPaths: ['auth.user', 'recipe.recipes', 'recipe.currentRecipe'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
