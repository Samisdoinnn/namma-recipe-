// Core Recipe Types
export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  ingredients: Ingredient[];
  steps: Step[];
  localeVariants: LocaleVariant[];
  tags: string[];
  servings: number;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface Step {
  id: string;
  order: number;
  instruction: string;
  imageUrl?: string;
  duration?: number; // in minutes
}

export interface LocaleVariant {
  locale: 'en' | 'hi' | 'kn';
  title: string;
  description: string;
  ingredients: {
    id: string;
    name: string;
    unit: string;
    notes?: string;
  }[];
  steps: {
    id: string;
    instruction: string;
  }[];
}

// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  favorites: string[]; // recipe IDs
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  locale: 'en' | 'hi' | 'kn';
  measurementSystem: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
}

// Collection Types
export interface RecipeCollection {
  id: string;
  title: string;
  description?: string;
  recipeIds: string[];
  ownerId: string;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  MainTabs: undefined;
  RecipeDetail: { recipeId: string };
  AddRecipe: undefined;
  EditRecipe: { recipeId: string };
  Auth: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Settings: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

// Search & Filter Types
export interface SearchFilters {
  query?: string;
  tags?: string[];
  difficulty?: Recipe['difficulty'][];
  maxPrepTime?: number;
  maxCookTime?: number;
}

// Share Types
export interface ShareData {
  recipeId: string;
  title: string;
  url: string;
}
