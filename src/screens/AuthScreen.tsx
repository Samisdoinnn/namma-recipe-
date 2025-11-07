import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { authService } from '@/services/firebase/auth';
import { COLORS, SPACING, TYPOGRAPHY, SCREEN_PADDING } from '@/constants/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';

type AuthScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Auth'>;
};

export default function AuthScreen({ navigation }: AuthScreenProps) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await authService.signInWithEmail(email, password);
      } else {
        await authService.signUpWithEmail(email, password, displayName);
      }
      navigation.replace('MainTabs');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isLogin ? t('auth.login') : t('auth.signup')}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <Input
              label={t('auth.displayName')}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="John Doe"
              autoCapitalize="words"
            />
          )}

          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
          />

          {!isLogin && (
            <Input
              label={t('auth.confirmPassword')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="********"
              secureTextEntry
            />
          )}

          <Button
            title={isLogin ? t('auth.login') : t('auth.signup')}
            onPress={handleAuth}
            loading={loading}
            style={styles.button}
          />

          <Button
            title={isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
            onPress={() => setIsLogin(!isLogin)}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SCREEN_PADDING,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  button: {
    marginBottom: SPACING.md,
  },
});
