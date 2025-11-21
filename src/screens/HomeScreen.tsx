import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Platform,
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
import { COLORS, SPACING, TYPOGRAPHY, SCREEN_PADDING, BORDER_RADIUS } from '@/constants/theme';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  
  const { recipes, isLoading } = useAppSelector(state => state.recipe);
  const { user } = useAppSelector(state => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadRecipes();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadRecipes = async () => {
    dispatch(setLoading(true));
    try {
      const fetchedRecipes = await firestoreService.recipes.getAll();
      dispatch(setRecipes(fetchedRecipes));
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      dispatch(setLoading(false));
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

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'italian', name: 'Italian' },
    { id: 'indian', name: 'Indian' },
    { id: 'dessert', name: 'Dessert' },
    { id: 'quick', name: 'Quick' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with gradient background */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.displayName || 'Chef'}!</Text>
            <Text style={styles.subtitle}>{t('home.title')}</Text>
          </View>
          <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
            <Ionicons name="add-circle" size={36} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('home.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipe List */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.featured')}</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>{t('home.viewAll')}</Text>
              </TouchableOpacity>
            </View>
            <RecipeList
              recipes={recipes}
              onRecipePress={handleRecipePress}
              onFavoritePress={handleFavoritePress}
              favoriteIds={user?.favorites || []}
              emptyMessage={t('home.noRecipes')}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textInverse,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.textInverse,
    marginTop: SPACING.xs,
  },
  addButton: {
    padding: SPACING.xs,
    backgroundColor: COLORS.textInverse,
    borderRadius: BORDER_RADIUS.round,
  },
  searchContainer: {
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: SPACING.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    paddingVertical: SPACING.xs,
  },
  categoriesContainer: {
    paddingHorizontal: SCREEN_PADDING,
  },
  categoriesContent: {
    flexDirection: 'row',
    paddingBottom: SPACING.md,
  },
  categoryButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: COLORS.textInverse,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_PADDING,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  viewAllText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});