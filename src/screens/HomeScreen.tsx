import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RecipeList } from '@/components/RecipeList';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setRecipes, setLoading } from '@/store/slices/recipeSlice';
import { toggleFavorite } from '@/store/slices/authSlice';
import { firestoreService } from '@/services/firebase/firestore';
import { Recipe, RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, SCREEN_PADDING } from '@/constants/theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  
  const { recipes, isLoading } = useAppSelector(state => state.recipe);
  const { user } = useAppSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    dispatch(setLoading(true));
    try {
      const fetchedRecipes = await firestoreService.recipes.getAll();
      dispatch(setRecipes(fetchedRecipes));
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  const handleRecipePress = (recipe: Recipe) => {
    navigation.navigate('RecipeDetail', { recipeId: recipe.id });
  };

  const handleFavoritePress = (recipeId: string) => {
    if (user) {
      dispatch(toggleFavorite(recipeId));
      firestoreService.users.toggleFavorite(user.id, recipeId);
    }
  };

  const handleAddRecipe = () => {
    navigation.navigate('AddRecipe');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('home.title')}</Text>
        <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
          <Ionicons name="add-circle" size={32} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.featured')}</Text>
          <RecipeList
            recipes={recipes}
            onRecipePress={handleRecipePress}
            onFavoritePress={handleFavoritePress}
            favoriteIds={user?.favorites || []}
            emptyMessage={t('home.noRecipes')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  addButton: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: SCREEN_PADDING,
    marginBottom: SPACING.sm,
  },
});
