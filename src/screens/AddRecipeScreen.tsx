import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { firestoreService } from '@/services/firebase/firestore';
import { useAppSelector } from '@/store/hooks';
import { Recipe, Ingredient, Step, RootStackParamList } from '@/types';
import { COLORS, SPACING, TYPOGRAPHY, SCREEN_PADDING } from '@/constants/theme';

type AddRecipeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddRecipe'>;

export default function AddRecipeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<AddRecipeScreenNavigationProp>();
  const { user } = useAppSelector(state => state.auth);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [servings, setServings] = useState('4');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !title || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        description,
        imageUrl: imageUrl || 'https://via.placeholder.com/400',
        authorId: user.id,
        authorName: user.displayName,
        ingredients: [],
        steps: [],
        localeVariants: [],
        tags: [],
        servings: parseInt(servings) || 4,
        prepTime: parseInt(prepTime) || 0,
        cookTime: parseInt(cookTime) || 0,
        difficulty,
        isPublished: true,
      };

      await firestoreService.recipes.create(recipe);
      Alert.alert('Success', 'Recipe created successfully!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{t('addRecipe.title')}</Text>

        <Input
          label={t('addRecipe.recipeName')}
          value={title}
          onChangeText={setTitle}
          placeholder="Delicious Recipe Name"
        />

        <Input
          label={t('addRecipe.description')}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your recipe..."
          multiline
          numberOfLines={4}
        />

        <Input
          label={t('addRecipe.photo')}
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://example.com/image.jpg"
          autoCapitalize="none"
        />

        <View style={styles.row}>
          <Input
            label={t('addRecipe.servings')}
            value={servings}
            onChangeText={setServings}
            keyboardType="number-pad"
            style={styles.halfInput}
          />

          <Input
            label={t('addRecipe.prepTime')}
            value={prepTime}
            onChangeText={setPrepTime}
            keyboardType="number-pad"
            placeholder="30"
            style={styles.halfInput}
          />
        </View>

        <Input
          label={t('addRecipe.cookTime')}
          value={cookTime}
          onChangeText={setCookTime}
          keyboardType="number-pad"
          placeholder="45"
        />

        <View style={styles.difficultyContainer}>
          <Text style={styles.label}>{t('addRecipe.difficulty')}</Text>
          <View style={styles.buttonGroup}>
            <Button
              title={t('common.easy')}
              onPress={() => setDifficulty('easy')}
              variant={difficulty === 'easy' ? 'primary' : 'outline'}
              size="small"
              style={styles.difficultyButton}
            />
            <Button
              title={t('common.medium')}
              onPress={() => setDifficulty('medium')}
              variant={difficulty === 'medium' ? 'primary' : 'outline'}
              size="small"
              style={styles.difficultyButton}
            />
            <Button
              title={t('common.hard')}
              onPress={() => setDifficulty('hard')}
              variant={difficulty === 'hard' ? 'primary' : 'outline'}
              size="small"
              style={styles.difficultyButton}
            />
          </View>
        </View>

        <Button
          title={t('addRecipe.publish')}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SCREEN_PADDING,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  difficultyContainer: {
    marginBottom: SPACING.md,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  difficultyButton: {
    flex: 1,
  },
  submitButton: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
});
