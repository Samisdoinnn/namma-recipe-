import authReducer, {
  setUser,
  setLoading,
  logout,
  toggleFavorite,
} from '../authSlice';
import { User } from '@/types';

const mockUser: User = {
  id: 'user1',
  email: 'test@example.com',
  displayName: 'Test User',
  favorites: ['recipe1', 'recipe2'],
  preferences: {
    locale: 'en',
    measurementSystem: 'metric',
    theme: 'light',
    notificationsEnabled: true,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('authSlice', () => {
  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
    });
  });

  it('should handle setUser', () => {
    const actual = authReducer(undefined, setUser(mockUser));
    expect(actual.user).toEqual(mockUser);
    expect(actual.isAuthenticated).toBe(true);
    expect(actual.isLoading).toBe(false);
  });

  it('should handle setLoading', () => {
    const actual = authReducer(undefined, setLoading(false));
    expect(actual.isLoading).toBe(false);
  });

  it('should handle logout', () => {
    const initialState = {
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    const actual = authReducer(initialState, logout());
    expect(actual.user).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });

  it('should handle toggleFavorite - add to favorites', () => {
    const initialState = {
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    const actual = authReducer(initialState, toggleFavorite('recipe3'));
    expect(actual.user?.favorites).toContain('recipe3');
    expect(actual.user?.favorites.length).toBe(3);
  });

  it('should handle toggleFavorite - remove from favorites', () => {
    const initialState = {
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    const actual = authReducer(initialState, toggleFavorite('recipe1'));
    expect(actual.user?.favorites).not.toContain('recipe1');
    expect(actual.user?.favorites.length).toBe(1);
  });
});
