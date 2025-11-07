import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUserPreferences, logout } from '@/store/slices/authSlice';
import { authService } from '@/services/firebase/auth';
import { firestoreService } from '@/services/firebase/firestore';
import { COLORS, SPACING, TYPOGRAPHY, SCREEN_PADDING, BORDER_RADIUS } from '@/constants/theme';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleLanguageChange = async (locale: 'en' | 'hi' | 'kn') => {
    if (user) {
      await i18n.changeLanguage(locale);
      dispatch(updateUserPreferences({ locale }));
      await firestoreService.users.update(user.id, {
        preferences: { ...user.preferences, locale },
      });
    }
  };

  const handleMeasurementSystemChange = async (system: 'metric' | 'imperial') => {
    if (user) {
      dispatch(updateUserPreferences({ measurementSystem: system }));
      await firestoreService.users.update(user.id, {
        preferences: { ...user.preferences, measurementSystem: system },
      });
    }
  };

  const handleThemeChange = async (theme: 'light' | 'dark' | 'auto') => {
    if (user) {
      dispatch(updateUserPreferences({ theme }));
      await firestoreService.users.update(user.id, {
        preferences: { ...user.preferences, theme },
      });
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.logout'),
          style: 'destructive',
          onPress: async () => {
            await authService.signOut();
            dispatch(logout());
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
          <View style={styles.card}>
            <Text style={styles.label}>{t('auth.email')}</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>{t('auth.displayName')}</Text>
            <Text style={styles.value}>{user?.displayName}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
          
          <View style={styles.card}>
            <Text style={styles.label}>{t('settings.language')}</Text>
            <View style={styles.buttonGroup}>
              <Button
                title="English"
                onPress={() => handleLanguageChange('en')}
                variant={user?.preferences.locale === 'en' ? 'primary' : 'outline'}
                size="small"
                style={styles.groupButton}
              />
              <Button
                title="हिंदी"
                onPress={() => handleLanguageChange('hi')}
                variant={user?.preferences.locale === 'hi' ? 'primary' : 'outline'}
                size="small"
                style={styles.groupButton}
              />
              <Button
                title="ಕನ್ನಡ"
                onPress={() => handleLanguageChange('kn')}
                variant={user?.preferences.locale === 'kn' ? 'primary' : 'outline'}
                size="small"
                style={styles.groupButton}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>{t('settings.measurementSystem')}</Text>
            <View style={styles.buttonGroup}>
              <Button
                title={t('settings.metric')}
                onPress={() => handleMeasurementSystemChange('metric')}
                variant={user?.preferences.measurementSystem === 'metric' ? 'primary' : 'outline'}
                size="small"
                style={styles.groupButton}
              />
              <Button
                title={t('settings.imperial')}
                onPress={() => handleMeasurementSystemChange('imperial')}
                variant={user?.preferences.measurementSystem === 'imperial' ? 'primary' : 'outline'}
                size="small"
                style={styles.groupButton}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Button
            title={t('settings.logout')}
            onPress={handleLogout}
            variant="outline"
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
    paddingHorizontal: SCREEN_PADDING,
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: SCREEN_PADDING,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  groupButton: {
    flex: 1,
    minWidth: 80,
  },
});
