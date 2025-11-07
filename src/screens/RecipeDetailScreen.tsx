import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { IngredientScaler } from '@/components/IngredientScaler';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrentRecipe, setLoading } from '@/store/slices/recipeSlice';
import { toggleFavorite } from '@/store/slices/authSlice';
import { firestoreService } from '@/services/firebase/firestore';
import { RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SCREEN_PADDING } from '@/constants/theme';

const { width } = Dimensions.get('window');

type RecipeDetailScreenRouteProp = RouteProp<RootStackParamList, 'RecipeDetail'>;

export default function RecipeDetailScreen() {
  const { t } = useTranslation();
  const route = useRoute<RecipeDetailScreenRouteProp>();
  const dispatch = useAppDispatch();
  const { recipeId } = route.params;

  const { currentRecipe } = useAppSelector(state => state.recipe);
  const { user } = useAppSelector(state => state.auth);
  const [localizedRecipe, setLocalizedRecipe] = useState(currentRecipe);

  const isFavorite = user?.favorites?.includes(recipeId) || false;

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  useEffect(() => {
    if (currentRecipe && user) {
      const locale = user.preferences.locale || 'en';
      const variant = currentRecipe.localeVariants?.find(v => v.locale === locale);
      
      if (variant) {
        setLocalizedRecipe({
          ...currentRecipe,
          title: variant.title,
          description: variant.description,
          ingredients: currentRecipe.ingredients.map(ing => {
            const localized = variant.ingredients.find(i => i.id === ing.id);
            return localized ? { ...ing, ...localized } : ing;
          }),
          steps: currentRecipe.steps.map(step => {
            const localized = variant.steps.find(s => s.id === step.id);
            return localized ? { ...step, instruction: localized.instruction } : step;
          }),
        });
      } else {
        setLocalizedRecipe(currentRecipe);
      }
    }
  }, [currentRecipe, user]);

  const loadRecipe = async () => {
    dispatch(setLoading(true));
    try {
      const recipe = await firestoreService.recipes.getById(recipeId);
      dispatch(setCurrentRecipe(recipe));
    } catch (error) {
      console.error('Error loading recipe:', error);
    }
  };

  const handleFavorite = () => {
    if (user) {
      dispatch(toggleFavorite(recipeId));
      firestoreService.users.toggleFavorite(user.id, recipeId);
    }
  };

  const handleShare = async () => {
    if (!localizedRecipe) return;
    
    try {
      await Share.share({
        message: t('common.shareRecipe', { title: localizedRecipe.title }),
        url: `recipeapp://recipe/${recipeId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`recipeapp://recipe/${recipeId}`);
    // Show toast notification
    console.log(t('common.copiedToClipboard'));
  };

  if (!localizedRecipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: localizedRecipe.imageUrl }} style={styles.headerImage} />
      
      <SafeAreaView edges={['bottom']} style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{localizedRecipe.title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleFavorite} style={styles.actionButton}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorite ? COLORS.error : COLORS.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Ionicons name="share-outline" size={28} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.description}>{localizedRecipe.description}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.metaLabel}>{t('recipeDetail.prepTime')}</Text>
            <Text style={styles.metaValue}>
              {t('common.minutes', { count: localizedRecipe.prepTime })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="flame-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.metaLabel}>{t('recipeDetail.cookTime')}</Text>
            <Text style={styles.metaValue}>
              {t('common.minutes', { count: localizedRecipe.cookTime })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="trending-up-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.metaLabel}>{t('recipeDetail.difficulty')}</Text>
            <Text style={styles.metaValue}>{t(`common.${localizedRecipe.difficulty}`)}</Text>
          </View>
        </View>

        <IngredientScaler
          ingredients={localizedRecipe.ingredients}
          defaultServings={localizedRecipe.servings}
        />

        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>{t('recipeDetail.instructions')}</Text>
          {localizedRecipe.steps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepText}>{step.instruction}</Text>
                {step.duration && (
                  <Text style={styles.stepDuration}>
                    {t('common.minutes', { count: step.duration })}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width,
    height: 300,
    backgroundColor: COLORS.backgroundDark,
  },
  content: {
    padding: SCREEN_PADDING,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.md,
    marginBottom: SPACING.lg,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.backgroundDark,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  metaItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  metaValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  instructionsSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '700',
    color: COLORS.textInverse,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
    lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.md,
  },
  stepDuration: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
