import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RecipeList } from '@/components/RecipeList';
import { useAppSelector } from '@/store/hooks';
import { firestoreService } from '@/services/firebase/firestore';
import { Recipe, RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, SCREEN_PADDING } from '@/constants/theme';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { user } = useAppSelector(state => state.auth);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, [user?.favorites]);

  const loadFavorites = async () => {
    if (!user || !user.favorites.length) {
      setFavoriteRecipes([]);
      return;
    }

    setLoading(true);
    try {
      const recipes = await Promise.all(
        user.favorites.map(id => firestoreService.recipes.getById(id))
      );
      setFavoriteRecipes(recipes.filter(r => r !== null) as Recipe[]);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = (recipe: Recipe) => {
    navigation.navigate('RecipeDetail', { recipeId: recipe.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('favorites.title')}</Text>
      </View>

      {favoriteRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t('favorites.empty')}</Text>
          <Text style={styles.emptyDescription}>{t('favorites.emptyDescription')}</Text>
        </View>
      ) : (
        <RecipeList
          recipes={favoriteRecipes}
          onRecipePress={handleRecipePress}
          favoriteIds={user?.favorites || []}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
