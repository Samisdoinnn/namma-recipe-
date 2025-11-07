const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const seedRecipes = [
  {
    title: 'Classic Margherita Pizza',
    description: 'Traditional Italian pizza with fresh mozzarella, tomatoes, and basil',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    authorId: 'seed_user',
    authorName: 'Recipe Master',
    servings: 4,
    prepTime: 20,
    cookTime: 15,
    difficulty: 'medium',
    isPublished: true,
    tags: ['Italian', 'Pizza', 'Vegetarian'],
    ingredients: [
      { id: '1', name: 'Pizza dough', quantity: 500, unit: 'g' },
      { id: '2', name: 'Tomato sauce', quantity: 200, unit: 'ml' },
      { id: '3', name: 'Fresh mozzarella', quantity: 250, unit: 'g' },
      { id: '4', name: 'Fresh basil', quantity: 10, unit: 'leaves' },
      { id: '5', name: 'Olive oil', quantity: 2, unit: 'tbsp' },
    ],
    steps: [
      { id: '1', order: 1, instruction: 'Preheat oven to 250°C (480°F)', duration: 15 },
      { id: '2', order: 2, instruction: 'Roll out the pizza dough on a floured surface', duration: 5 },
      { id: '3', order: 3, instruction: 'Spread tomato sauce evenly over the dough', duration: 2 },
      { id: '4', order: 4, instruction: 'Add torn mozzarella pieces', duration: 2 },
      { id: '5', order: 5, instruction: 'Bake for 12-15 minutes until golden', duration: 15 },
      { id: '6', order: 6, instruction: 'Top with fresh basil and olive oil before serving', duration: 1 },
    ],
    localeVariants: [
      {
        locale: 'hi',
        title: 'क्लासिक मार्गेरिटा पिज्जा',
        description: 'ताज़ा मोज़ेरेला, टमाटर और तुलसी के साथ पारंपरिक इतालवी पिज्जा',
        ingredients: [
          { id: '1', name: 'पिज्जा का आटा', unit: 'ग्राम' },
          { id: '2', name: 'टमाटर की चटनी', unit: 'मिली' },
          { id: '3', name: 'ताज़ा मोज़ेरेला', unit: 'ग्राम' },
          { id: '4', name: 'ताज़ी तुलसी', unit: 'पत्तियाँ' },
          { id: '5', name: 'ऑलिव ऑयल', unit: 'चम्मच' },
        ],
        steps: [
          { id: '1', instruction: 'ओवन को 250°C पर गर्म करें' },
          { id: '2', instruction: 'पिज्जा के आटे को आटे वाली सतह पर बेलें' },
          { id: '3', instruction: 'टमाटर की चटनी को समान रूप से फैलाएं' },
          { id: '4', instruction: 'मोज़ेरेला के टुकड़े डालें' },
          { id: '5', instruction: '12-15 मिनट तक सुनहरा होने तक बेक करें' },
          { id: '6', instruction: 'परोसने से पहले ताज़ी तुलसी और ऑलिव ऑयल डालें' },
        ],
      },
      {
        locale: 'kn',
        title: 'ಕ್ಲಾಸಿಕ್ ಮಾರ್ಗರಿಟಾ ಪಿಜ್ಜಾ',
        description: 'ತಾಜಾ ಮೊಝಾರೆಲ್ಲಾ, ಟೊಮೇಟೊ ಮತ್ತು ತುಳಸಿಯೊಂದಿಗೆ ಸಾಂಪ್ರದಾಯಿಕ ಇಟಾಲಿಯನ್ ಪಿಜ್ಜಾ',
        ingredients: [
          { id: '1', name: 'ಪಿಜ್ಜಾ ಹಿಟ್ಟು', unit: 'ಗ್ರಾಂ' },
          { id: '2', name: 'ಟೊಮೇಟೊ ಸಾಸ್', unit: 'ಮಿಲಿ' },
          { id: '3', name: 'ತಾಜಾ ಮೊಝಾರೆಲ್ಲಾ', unit: 'ಗ್ರಾಂ' },
          { id: '4', name: 'ತಾಜಾ ತುಳಸಿ', unit: 'ಎಲೆಗಳು' },
          { id: '5', name: 'ಆಲಿವ್ ಎಣ್ಣೆ', unit: 'ಚಮಚ' },
        ],
        steps: [
          { id: '1', instruction: 'ಓವನ್ ಅನ್ನು 250°C ಗೆ ಪೂರ್ವಭಾವಿಸಿ' },
          { id: '2', instruction: 'ಪಿಜ್ಜಾ ಹಿಟ್ಟನ್ನು ಮೇಲ್ಮೈಯಲ್ಲಿ ರೋಲ್ ಮಾಡಿ' },
          { id: '3', instruction: 'ಟೊಮೇಟೊ ಸಾಸ್ ಅನ್ನು ಸಮವಾಗಿ ಹರಡಿ' },
          { id: '4', instruction: 'ಮೊಝಾರೆಲ್ಲಾ ತುಂಡುಗಳನ್ನು ಸೇರಿಸಿ' },
          { id: '5', instruction: '12-15 ನಿಮಿಷಗಳ ಕಾಲ ಬೇಯಿಸಿ' },
          { id: '6', instruction: 'ತಾಜಾ ತುಳಸಿ ಮತ್ತು ಆಲಿವ್ ಎಣ್ಣೆ ಸೇರಿಸಿ' },
        ],
      },
    ],
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'Creamy Indian curry with marinated grilled chicken',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
    authorId: 'seed_user',
    authorName: 'Recipe Master',
    servings: 6,
    prepTime: 30,
    cookTime: 40,
    difficulty: 'medium',
    isPublished: true,
    tags: ['Indian', 'Curry', 'Chicken', 'Spicy'],
    ingredients: [
      { id: '1', name: 'Chicken breast', quantity: 800, unit: 'g' },
      { id: '2', name: 'Yogurt', quantity: 200, unit: 'ml' },
      { id: '3', name: 'Tomato sauce', quantity: 400, unit: 'ml' },
      { id: '4', name: 'Heavy cream', quantity: 200, unit: 'ml' },
      { id: '5', name: 'Garam masala', quantity: 2, unit: 'tbsp' },
      { id: '6', name: 'Ginger-garlic paste', quantity: 2, unit: 'tbsp' },
    ],
    steps: [
      { id: '1', order: 1, instruction: 'Marinate chicken in yogurt and spices for 2 hours', duration: 120 },
      { id: '2', order: 2, instruction: 'Grill marinated chicken until charred', duration: 15 },
      { id: '3', order: 3, instruction: 'Sauté onions and ginger-garlic paste', duration: 5 },
      { id: '4', order: 4, instruction: 'Add tomato sauce and spices, simmer', duration: 10 },
      { id: '5', order: 5, instruction: 'Add grilled chicken and cream, cook for 10 minutes', duration: 10 },
      { id: '6', order: 6, instruction: 'Garnish with cilantro and serve with rice', duration: 2 },
    ],
    localeVariants: [
      {
        locale: 'hi',
        title: 'चिकन टिक्का मसाला',
        description: 'मैरीनेट किए हुए ग्रिल्ड चिकन के साथ क्रीमी भारतीय करी',
        ingredients: [
          { id: '1', name: 'चिकन ब्रेस्ट', unit: 'ग्राम' },
          { id: '2', name: 'दही', unit: 'मिली' },
          { id: '3', name: 'टमाटर की चटनी', unit: 'मिली' },
          { id: '4', name: 'ताज़ी क्रीम', unit: 'मिली' },
          { id: '5', name: 'गरम मसाला', unit: 'चम्मच' },
          { id: '6', name: 'अदरक-लहसुन पेस्ट', unit: 'चम्मच' },
        ],
        steps: [
          { id: '1', instruction: 'चिकन को दही और मसालों में 2 घंटे के लिए मैरीनेट करें' },
          { id: '2', instruction: 'मैरीनेट किए हुए चिकन को ग्रिल करें' },
          { id: '3', instruction: 'प्याज और अदरक-लहसुन पेस्ट भूनें' },
          { id: '4', instruction: 'टमाटर की चटनी और मसाले डालें' },
          { id: '5', instruction: 'ग्रिल्ड चिकन और क्रीम डालें' },
          { id: '6', instruction: 'धनिया से सजाएं और चावल के साथ परोसें' },
        ],
      },
      {
        locale: 'kn',
        title: 'ಚಿಕನ್ ಟಿಕ್ಕಾ ಮಸಾಲಾ',
        description: 'ಮ್ಯಾರಿನೇಟ್ ಮಾಡಿದ ಗ್ರಿಲ್ಡ್ ಚಿಕನ್ ಜೊತೆ ಕ್ರೀಮಿ ಭಾರತೀಯ ಕರಿ',
        ingredients: [
          { id: '1', name: 'ಚಿಕನ್ ಸ್ತನ', unit: 'ಗ್ರಾಂ' },
          { id: '2', name: 'ಮೊಸರು', unit: 'ಮಿಲಿ' },
          { id: '3', name: 'ಟೊಮೇಟೊ ಸಾಸ್', unit: 'ಮಿಲಿ' },
          { id: '4', name: 'ಕ್ರೀಮ್', unit: 'ಮಿಲಿ' },
          { id: '5', name: 'ಗರಂ ಮಸಾಲಾ', unit: 'ಚಮಚ' },
          { id: '6', name: 'ಶುಂಠಿ-ಬೆಳ್ಳುಳ್ಳಿ ಪೇಸ್ಟ್', unit: 'ಚಮಚ' },
        ],
        steps: [
          { id: '1', instruction: 'ಚಿಕನ್ ಅನ್ನು ಮೊಸರು ಮತ್ತು ಮಸಾಲೆಗಳಲ್ಲಿ 2 ಗಂಟೆಗಳ ಕಾಲ ಮ್ಯಾರಿನೇಟ್ ಮಾಡಿ' },
          { id: '2', instruction: 'ಮ್ಯಾರಿನೇಟ್ ಮಾಡಿದ ಚಿಕನ್ ಅನ್ನು ಗ್ರಿಲ್ ಮಾಡಿ' },
          { id: '3', instruction: 'ಈರುಳ್ಳಿ ಮತ್ತು ಶುಂಠಿ-ಬೆಳ್ಳುಳ್ಳಿ ಪೇಸ್ಟ್ ಅನ್ನು ಬೆಳ್ಳುಳ್ಳಿ ಮಾಡಿ' },
          { id: '4', instruction: 'ಟೊಮೇಟೊ ಸಾಸ್ ಮತ್ತು ಮಸಾಲೆಗಳನ್ನು ಸೇರಿಸಿ' },
          { id: '5', instruction: 'ಗ್ರಿಲ್ಡ್ ಚಿಕನ್ ಮತ್ತು ಕ್ರೀಮ್ ಸೇರಿಸಿ' },
          { id: '6', instruction: 'ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪಿನಿಂದ ಅಲಂಕರಿಸಿ ಮತ್ತು ಅನ್ನದೊಂದಿಗೆ ಬಡಿಸಿ' },
        ],
      },
    ],
  },
  // Add more recipes here...
];

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    const batch = db.batch();

    seedRecipes.forEach((recipe, index) => {
      const docRef = db.collection('recipes').doc();
      batch.set(docRef, {
        ...recipe,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Added recipe ${index + 1}: ${recipe.title}`);
    });

    await batch.commit();
    console.log('✅ Database seeded successfully!');
    console.log(`Total recipes added: ${seedRecipes.length}`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
