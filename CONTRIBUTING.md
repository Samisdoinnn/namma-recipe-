# Contributing to Recipe App

First off, thank you for considering contributing to Recipe App! It's people like you that make Recipe App such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Follow the TypeScript styleguide
- Include tests for new features
- Update documentation accordingly
- End all files with a newline

## Development Process

1. Fork the repo
2. Create a new branch from `develop`
3. Make your changes
4. Write or adapt tests as needed
5. Run the test suite
6. Push to your fork
7. Submit a pull request to `develop`

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/recipe-app.git
cd recipe-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Code Style

We use ESLint and Prettier to maintain code quality and consistency.

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Styleguide

- Use TypeScript for all new code
- Prefer interfaces over types
- Use meaningful variable names
- Add JSDoc comments for functions
- Avoid `any` type when possible

### Component Styleguide

```typescript
// Good
interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  // Component logic
};
```

### Testing Styleguide

- Write descriptive test names
- Test user behavior, not implementation
- Use data-testid for important elements
- Mock external dependencies

```typescript
describe('RecipeCard', () => {
  it('should call onPress when card is tapped', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <RecipeCard recipe={mockRecipe} onPress={onPressMock} />
    );
    fireEvent.press(getByText('Test Recipe'));
    expect(onPressMock).toHaveBeenCalled();
  });
});
```

## Project Structure

```
src/
├── components/      # Reusable components
├── screens/         # Screen components
├── navigation/      # Navigation configuration
├── store/           # Redux state management
├── services/        # External services (Firebase, etc.)
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── constants/       # App constants
└── i18n/            # Internationalization
```

## Adding New Features

1. Create a new branch: `git checkout -b feature/amazing-feature`
2. Implement your feature
3. Add tests
4. Update documentation
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Translation Contributions

We welcome translations! To add a new language:

1. Create a new JSON file in `src/i18n/locales/`
2. Copy the structure from `en.json`
3. Translate all strings
4. Update `src/i18n/index.ts` to include the new locale
5. Test the translations in the app

## Documentation

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for architectural changes
- Add JSDoc comments for complex functions
- Include code examples where helpful

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
