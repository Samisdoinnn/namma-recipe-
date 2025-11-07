import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input } from '@/components/Input';
import { RecipeList } from '@/components/RecipeList';
import { firestoreService } from '@/services/firebase/firestore';
import { useAppSelector } from '@/store/hooks';
import { Recipe, RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, SCREEN_PADDING } from '@/constants/theme';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { user } = useAppSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await firestoreService.recipes.search(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching recipes:', error);
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
        <Text style={styles.title}>{t('search.title')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder={t('home.searchPlaceholder')}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.resultsContainer}>
        {searchQuery.length >= 2 && (
          <Text style={styles.resultsText}>
            {t('search.results', { count: searchResults.length })}
          </Text>
        )}

        <RecipeList
          recipes={searchResults}
          onRecipePress={handleRecipePress}
          favoriteIds={user?.favorites || []}
          emptyMessage={
            searchQuery.length < 2
              ? t('search.enterQuery')
              : t('search.noResults')
          }
        />
      </View>
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
  searchContainer: {
    paddingHorizontal: SCREEN_PADDING,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsText: {
    paddingHorizontal: SCREEN_PADDING,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
});
