import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './src/store';
import { useAppDispatch } from './src/store/hooks';
import { setUser, setLoading } from './src/store/slices/authSlice';
import { authService } from './src/services/firebase/auth';
import { firestoreService } from './src/services/firebase/firestore';
import RootNavigator from './src/navigation/RootNavigator';
import './src/i18n';

const queryClient = new QueryClient();

function AppContent() {
  const dispatch = useAppDispatch();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        try {
          const userData = await firestoreService.users.getById(firebaseUser.uid);
          if (userData) {
            dispatch(setUser(userData));
          } else {
            // Create user document if it doesn't exist
            const newUser = {
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || undefined,
              favorites: [],
              preferences: {
                locale: 'en' as const,
                measurementSystem: 'metric' as const,
                theme: 'auto' as const,
                notificationsEnabled: true,
              },
            };
            await firestoreService.users.create(firebaseUser.uid, newUser);
            dispatch(
              setUser({
                id: firebaseUser.uid,
                ...newUser,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            );
          }
        } catch (error) {
          console.error('Error loading user:', error);
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}
