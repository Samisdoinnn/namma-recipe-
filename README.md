# Recipe App - Production-Ready React Native Application

A full-featured recipe application built with React Native, TypeScript, and Firebase, featuring multilingual support (English, Hindi, Kannada) and offline capabilities.

## 📱 Features

- **Browse & Discover**: Explore a curated collection of recipes with beautiful imagery
- **Recipe Details**: View detailed cooking instructions with ingredient scaling
- **Favorites**: Save your favorite recipes for quick access
- **Search & Filter**: Find recipes by name, tags, difficulty, or cooking time
- **Multilingual Support**: Full i18n support for English, Hindi (hi-IN), and Kannada (kn-IN)
- **Offline Mode**: Access saved recipes without an internet connection
- **Share Recipes**: Share your favorite recipes via native sharing or copy link
- **User Authentication**: Email/password and Google Sign-In
- **Add Recipes**: Create and publish your own recipes
- **Ingredient Scaling**: Automatically adjust ingredient quantities based on servings
- **Dark Mode Ready**: Theme support for light, dark, and auto modes

## 🏗️ Architecture

```
react-native-recipe-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeList.tsx
│   │   ├── IngredientScaler.tsx
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── screens/             # Application screens
│   │   ├── AuthScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── RecipeDetailScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── AddRecipeScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/          # Navigation configuration
│   │   └── RootNavigator.tsx
│   ├── store/               # Redux state management
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   └── recipeSlice.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   ├── services/            # External services
│   │   └── firebase/
│   │       ├── config.ts
│   │       ├── index.ts
│   │       ├── auth.ts
│   │       └── firestore.ts
│   ├── i18n/                # Internationalization
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   └── kn.json
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── constants/           # App constants and theme
│   │   └── theme.ts
│   └── utils/               # Utility functions
├── scripts/                 # Build and deployment scripts
│   └── seedData.js
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── tsconfig.json            # TypeScript configuration
├── jest.config.js           # Jest configuration
└── package.json             # Dependencies

```

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation (v7)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **i18n**: react-i18next
- **Data Fetching**: TanStack React Query
- **Testing**: Jest + React Native Testing Library
- **CI/CD**: GitHub Actions + EAS Build
- **Linting**: ESLint + Prettier

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator
- Firebase account

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/recipe-app.git
cd recipe-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google Sign-In)
3. Create a Firestore database
4. Enable Firebase Storage
5. Copy your Firebase configuration

### Step 4: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your Firebase credentials in `.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Step 5: Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### Step 6: Seed Database (Optional)

```bash
cd scripts
npm install firebase-admin
# Add your serviceAccountKey.json
node seedData.js
```

## 🚀 Running the App

### Development Mode

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

### Production Build

Using EAS Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🎨 Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📱 Deployment

### Android (Google Play Store)

1. Build production APK/AAB:
   ```bash
   eas build --platform android --profile production
   ```

2. Submit to Google Play:
   ```bash
   eas submit --platform android
   ```

### iOS (App Store)

1. Build production IPA:
   ```bash
   eas build --platform ios --profile production
   ```

2. Submit to App Store:
   ```bash
   eas submit --platform ios
   ```

## 🌍 Internationalization

The app supports three languages:
- English (en)
- Hindi (hi-IN)
- Kannada (kn-IN)

Translation files are located in `src/i18n/locales/`. To add a new language:

1. Create a new JSON file in `src/i18n/locales/`
2. Add translations following the existing structure
3. Update `src/i18n/index.ts` to include the new locale
4. Update `SUPPORTED_LOCALES` in `src/constants/theme.ts`

## 🔐 Firebase Security

Firestore and Storage security rules are defined in:
- `firestore.rules` - Database access control
- `storage.rules` - File storage access control

Key security features:
- Users can only modify their own data
- Recipe authors have full control over their recipes
- Public recipes are readable by all
- Image uploads are restricted to authenticated users

## 📊 Data Models

### User
```typescript
{
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  favorites: string[];
  preferences: {
    locale: 'en' | 'hi' | 'kn';
    measurementSystem: 'metric' | 'imperial';
    theme: 'light' | 'dark' | 'auto';
    notificationsEnabled: boolean;
  };
}
```

### Recipe
```typescript
{
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  ingredients: Ingredient[];
  steps: Step[];
  localeVariants: LocaleVariant[];
  tags: string[];
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isPublished: boolean;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - shameer

## 🙏 Acknowledgments

- Firebase for backend services
- Expo for amazing development experience
- React Navigation for smooth navigation
- All open-source contributors

## 📞 Support

For support, email support@recipeapp.com or join our Slack channel.

---

Made with ❤️ using React Native and TypeScript
