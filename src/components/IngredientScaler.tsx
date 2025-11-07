import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Ingredient } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/constants/theme';

interface IngredientScalerProps {
  ingredients: Ingredient[];
  defaultServings: number;
}

export const IngredientScaler: React.FC<IngredientScalerProps> = ({
  ingredients,
  defaultServings,
}) => {
  const { t } = useTranslation();
  const [servings, setServings] = useState(defaultServings);

  const scaleFactor = servings / defaultServings;

  const increaseServings = () => setServings(prev => Math.min(prev + 1, 20));
  const decreaseServings = () => setServings(prev => Math.max(prev - 1, 1));

  const scaleQuantity = (quantity: number): string => {
    const scaled = quantity * scaleFactor;
    // Round to 2 decimal places and remove trailing zeros
    return parseFloat(scaled.toFixed(2)).toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('recipeDetail.ingredients')}</Text>
        <View style={styles.servingsControl}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={decreaseServings}
            disabled={servings <= 1}
          >
            <Ionicons
              name="remove"
              size={20}
              color={servings <= 1 ? COLORS.textLight : COLORS.primary}
            />
          </TouchableOpacity>
          <View style={styles.servingsDisplay}>
            <Text style={styles.servingsNumber}>{servings}</Text>
            <Text style={styles.servingsLabel}>{t('recipeDetail.servings')}</Text>
          </View>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={increaseServings}
            disabled={servings >= 20}
          >
            <Ionicons
              name="add"
              size={20}
              color={servings >= 20 ? COLORS.textLight : COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.ingredientsList}>
        {ingredients.map(ingredient => (
          <View key={ingredient.id} style={styles.ingredientItem}>
            <View style={styles.ingredientBullet} />
            <View style={styles.ingredientContent}>
              <Text style={styles.ingredientName}>
                {ingredient.name}
                {ingredient.notes && (
                  <Text style={styles.ingredientNotes}> ({ingredient.notes})</Text>
                )}
              </Text>
              <Text style={styles.ingredientQuantity}>
                {scaleQuantity(ingredient.quantity)} {ingredient.unit}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
  },
  controlButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingsDisplay: {
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  servingsNumber: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  servingsLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textSecondary,
  },
  ingredientsList: {
    gap: SPACING.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 8,
    marginRight: SPACING.sm,
  },
  ingredientContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
  },
  ingredientNotes: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  ingredientQuantity: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
});
