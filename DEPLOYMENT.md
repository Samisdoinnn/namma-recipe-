# Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- ✅ Firebase project configured
- ✅ Apple Developer Account (for iOS)
- ✅ Google Play Console Account (for Android)
- ✅ EAS CLI installed (`npm install -g eas-cli`)
- ✅ All environment variables configured

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the setup wizard

### 2. Enable Authentication

```bash
# Enable Email/Password
1. Navigate to Authentication → Sign-in method
2. Enable "Email/Password"

# Enable Google Sign-In
1. Enable "Google" provider
2. Add your OAuth client ID
```

### 3. Create Firestore Database

```bash
1. Navigate to Firestore Database
2. Click "Create Database"
3. Start in production mode
4. Choose a location
```

### 4. Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

### 5. Get Firebase Configuration

```bash
1. Project Settings → General
2. Scroll to "Your apps"
3. Add iOS app
4. Add Android app
5. Download configuration files:
   - google-services.json (Android)
   - GoogleService-Info.plist (iOS)
```

## Environment Configuration

### 1. Create .env File

```bash
cp .env.example .env
```

### 2. Fill in Firebase Credentials

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## EAS Build Setup

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Login to Expo

```bash
eas login
```

### 3. Configure EAS Build

```bash
eas build:configure
```

This creates `eas.json` with build profiles.

### 4. Update app.json

```json
{
  "expo": {
    "name": "Recipe App",
    "slug": "recipe-app",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.recipeapp"
    },
    "android": {
      "package": "com.yourcompany.recipeapp"
    }
  }
}
```

## Building for Production

### Android Build

#### Step 1: Generate Keystore

```bash
keytool -genkey -v -keystore recipe-app.keystore -alias recipe-app -keyalg RSA -keysize 2048 -validity 10000
```

#### Step 2: Build APK/AAB

```bash
# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for production)
eas build --platform android --profile production
```

#### Step 3: Submit to Google Play

```bash
# Manual submission
1. Download the AAB from EAS
2. Upload to Google Play Console
3. Complete store listing
4. Submit for review

# Automated submission
eas submit --platform android
```

### iOS Build

#### Step 1: Apple Developer Setup

```bash
1. Enroll in Apple Developer Program
2. Create App ID in Apple Developer Portal
3. Create provisioning profile
```

#### Step 2: Build IPA

```bash
# Build for App Store
eas build --platform ios --profile production
```

#### Step 3: Submit to App Store

```bash
# Manual submission
1. Download IPA from EAS
2. Use Transporter app to upload
3. Complete App Store listing
4. Submit for review

# Automated submission
eas submit --platform ios
```

## Over-The-Air (OTA) Updates

### Enable OTA Updates

```bash
# Install expo-updates
expo install expo-updates

# Publish update
eas update --branch production
```

### Configure Auto Updates

In `app.json`:

```json
{
  "expo": {
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/[your-project-id]"
    }
  }
}
```

## CI/CD with GitHub Actions

### Setup Secrets

Add these secrets to your GitHub repository:

```
EXPO_TOKEN          # Your Expo access token
FIREBASE_TOKEN      # Firebase CI token
ANDROID_KEYSTORE    # Base64 encoded keystore
IOS_DIST_CERT       # iOS distribution certificate
IOS_PROFILE         # iOS provisioning profile
```

### Automated Deployment

Push to `main` branch triggers:
1. Lint & Test
2. Build APK/IPA
3. Deploy to Firebase Hosting (if web enabled)
4. OTA update publication

## Testing Deployment

### Android Testing

```bash
# Install on device/emulator
adb install app-release.apk

# Check logs
adb logcat | grep ReactNative
```

### iOS Testing

```bash
# Using TestFlight
1. Build with production profile
2. Upload to App Store Connect
3. Add internal testers
4. Distribute build
```

## Production Checklist

### Pre-Launch

- [ ] Firebase security rules deployed
- [ ] Environment variables configured
- [ ] App icons and splash screens added
- [ ] Privacy policy and terms created
- [ ] Analytics configured
- [ ] Crash reporting enabled (Sentry/Firebase Crashlytics)
- [ ] Performance monitoring enabled
- [ ] Push notification certificates configured
- [ ] In-app purchases configured (if applicable)

### Post-Launch

- [ ] Monitor error logs
- [ ] Track analytics
- [ ] Respond to user reviews
- [ ] Plan OTA updates
- [ ] Monitor Firebase usage
- [ ] Set up alerts for crashes

## Monitoring & Analytics

### Firebase Analytics

```typescript
import analytics from '@react-native-firebase/analytics';

// Track screen views
analytics().logScreenView({
  screen_name: 'Home',
  screen_class: 'HomeScreen',
});

// Track events
analytics().logEvent('recipe_viewed', {
  recipe_id: 'pizza-123',
  category: 'Italian',
});
```

### Error Tracking

Consider integrating:
- Sentry
- Firebase Crashlytics
- Bugsnag

## Rollback Strategy

### If Build Fails

```bash
# Revert to previous build
eas build:list
eas build:download --id=[build-id]
```

### If Update Causes Issues

```bash
# Publish previous update
eas update --branch production --message "Rollback to stable"
```

## Cost Optimization

### Firebase

- Enable offline persistence
- Optimize Firestore queries
- Use Cloud Storage compression
- Set up billing alerts

### Expo EAS

- Use appropriate build profiles
- Limit concurrent builds
- Clean old builds regularly

## Support & Troubleshooting

### Common Issues

**Build fails:**
- Check `eas.json` configuration
- Verify credentials
- Review build logs

**OTA update not working:**
- Check `expo-updates` configuration
- Verify update channel
- Clear app cache

**Firebase connection issues:**
- Verify `google-services.json`/`GoogleService-Info.plist`
- Check Firebase project settings
- Ensure API keys are correct

### Get Help

- Expo Forums: https://forums.expo.dev
- Firebase Support: https://firebase.google.com/support
- Stack Overflow: Tag with `react-native`, `expo`, `firebase`

## Next Steps

1. Set up monitoring and analytics
2. Plan feature releases
3. Collect user feedback
4. Iterate and improve

---

🎉 **Congratulations on deploying your Recipe App!**
