# Quick Start Guide

Get your Recipe App up and running in 5 minutes! 🚀

## ⚡ Fast Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/recipe-app.git
cd recipe-app

# Install dependencies
npm install
```

### 2. Firebase Quick Setup (2 minutes)

**Option A: Use Demo Mode (Quickest)**
```bash
# Copy example env
cp .env.example .env

# App will run in demo mode (limited functionality)
npm start
```

**Option B: Setup Firebase (Recommended)**

1. Create a Firebase project: https://console.firebase.google.com/
2. Copy your config to `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

### 3. Run the App (1 minute)

```bash
# Start Expo development server
npm start

# Then press:
# i - for iOS Simulator
# a - for Android Emulator
# w - for Web Browser
```

## 📱 Testing on Your Phone

1. Install **Expo Go** app:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code from your terminal

3. Start exploring! 🎉

## 🔥 Next Steps

### Enable All Features

```bash
# 1. Enable Firebase Authentication
Go to Firebase Console → Authentication → Sign-in method
Enable: Email/Password

# 2. Create Firestore Database
Go to Firebase Console → Firestore Database → Create Database
Start in test mode

# 3. Deploy Security Rules
firebase deploy --only firestore:rules

# 4. Add Sample Data
cd scripts
node seedData.js
```

### Customize Your App

1. **Update App Name**
   - Edit `app.json` → `expo.name`

2. **Change App Icon**
   - Replace `assets/icon.png`

3. **Update Colors**
   - Edit `src/constants/theme.ts`

4. **Add Your Recipes**
   - Use the "Add Recipe" button in the app
   - Or add to `scripts/seedData.js`

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --clear
```

### iOS Build Fails
```bash
cd ios && pod install && cd ..
```

### Android Build Issues
```bash
cd android && ./gradlew clean && cd ..
```

### Firebase Connection Issues
- Verify `.env` file exists
- Check Firebase config values
- Ensure Firebase project is active

## 📚 Learn More

- **Full Documentation**: [README.md](./README.md)
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)

## 💡 Quick Commands

```bash
# Development
npm start              # Start dev server
npm run ios           # Run on iOS
npm run android       # Run on Android
npm run web           # Run on web

# Testing
npm test              # Run tests
npm run lint          # Check code quality
npm run format        # Format code

# Building
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

## 🎯 Test Credentials (Demo Mode)

If using seed data:
```
Email: test@example.com
Password: password123
```

## 🌟 Features to Try

1. **Browse Recipes** - Swipe through beautiful recipe cards
2. **Search** - Find recipes by name or ingredients
3. **Favorites** - Save your favorite recipes
4. **Add Recipe** - Create your own recipes
5. **Language Switch** - Try English, Hindi, or Kannada
6. **Share** - Share recipes with friends
7. **Ingredient Scaling** - Adjust serving sizes

## ⚙️ Configuration Tips

### Performance
- Enable Hermes engine (already configured)
- Use production builds for testing performance
- Enable offline caching for better UX

### Development
- Use React DevTools for debugging
- Enable Fast Refresh for instant updates
- Use Expo Go for quick testing

### Production
- Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
- Test on real devices before release
- Monitor analytics and crashes

## 🆘 Need Help?

- 📖 Check the [README](./README.md)
- 🐛 [Open an Issue](https://github.com/yourusername/recipe-app/issues)
- 💬 [Join our Discord](#)
- 📧 Email: support@recipeapp.com

---

**Ready to cook up something amazing? Happy coding! 👨‍🍳👩‍🍳**
