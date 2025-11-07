import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { RecipeCard } from './RecipeCard';
import { Recipe } from '@/types';
import { SPACING, COLORS, TYPOGRAPHY } from '@/constants/theme';

interface RecipeListProps {
  recipes: Recipe[];
  onRecipePress: (recipe: Recipe) => void;
  onFavoritePress?: (recipeId: string) => void;
  favoriteIds?: string[];
  emptyMessage?: string;
  numColumns?: number;
}

export const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  onRecipePress,
  onFavoritePress,
  favoriteIds = [],
  emptyMessage = 'No recipes found',
  numColumns = 2,
}) => {
  const renderItem = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onPress={() => onRecipePress(item)}
      onFavoritePress={onFavoritePress ? () => onFavoritePress(item.id) : undefined}
      isFavorite={favoriteIds.includes(item.id)}
    />
  );

  if (recipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={recipes}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: SPACING.md,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
