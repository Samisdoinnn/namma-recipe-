import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './index';
import { FIREBASE_COLLECTIONS } from './config';
import { Recipe, User, RecipeCollection } from '@/types';

export const firestoreService = {
  // Recipe operations
  recipes: {
    getAll: async (filters?: QueryConstraint[]): Promise<Recipe[]> => {
      const recipesRef = collection(db, FIREBASE_COLLECTIONS.RECIPES);
      const q = filters ? query(recipesRef, ...filters) : query(recipesRef);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Recipe[];
    },

    getById: async (id: string): Promise<Recipe | null> => {
      const recipeRef = doc(db, FIREBASE_COLLECTIONS.RECIPES, id);
      const snapshot = await getDoc(recipeRef);
      if (!snapshot.exists()) return null;
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate(),
        updatedAt: snapshot.data().updatedAt?.toDate(),
      } as Recipe;
    },

    create: async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
      const recipesRef = collection(db, FIREBASE_COLLECTIONS.RECIPES);
      const now = Timestamp.now();
      const docRef = await addDoc(recipesRef, {
        ...recipe,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    },

    update: async (id: string, recipe: Partial<Recipe>): Promise<void> => {
      const recipeRef = doc(db, FIREBASE_COLLECTIONS.RECIPES, id);
      await updateDoc(recipeRef, {
        ...recipe,
        updatedAt: Timestamp.now(),
      });
    },

    delete: async (id: string): Promise<void> => {
      const recipeRef = doc(db, FIREBASE_COLLECTIONS.RECIPES, id);
      await deleteDoc(recipeRef);
    },

    search: async (searchQuery: string): Promise<Recipe[]> => {
      const recipesRef = collection(db, FIREBASE_COLLECTIONS.RECIPES);
      const q = query(
        recipesRef,
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const recipes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Recipe[];

      // Client-side search filtering
      const lowercaseQuery = searchQuery.toLowerCase();
      return recipes.filter(
        recipe =>
          recipe.title.toLowerCase().includes(lowercaseQuery) ||
          recipe.description.toLowerCase().includes(lowercaseQuery) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    },
  },

  // User operations
  users: {
    getById: async (id: string): Promise<User | null> => {
      const userRef = doc(db, FIREBASE_COLLECTIONS.USERS, id);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) return null;
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt?.toDate(),
        updatedAt: snapshot.data().updatedAt?.toDate(),
      } as User;
    },

    create: async (id: string, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
      const userRef = doc(db, FIREBASE_COLLECTIONS.USERS, id);
      const now = Timestamp.now();
      await updateDoc(userRef, {
        ...user,
        createdAt: now,
        updatedAt: now,
      });
    },

    update: async (id: string, user: Partial<User>): Promise<void> => {
      const userRef = doc(db, FIREBASE_COLLECTIONS.USERS, id);
      await updateDoc(userRef, {
        ...user,
        updatedAt: Timestamp.now(),
      });
    },

    toggleFavorite: async (userId: string, recipeId: string): Promise<void> => {
      const userRef = doc(db, FIREBASE_COLLECTIONS.USERS, userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) return;

      const favorites = userDoc.data().favorites || [];
      const index = favorites.indexOf(recipeId);

      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(recipeId);
      }

      await updateDoc(userRef, {
        favorites,
        updatedAt: Timestamp.now(),
      });
    },
  },

  // Collection operations
  collections: {
    getByUserId: async (userId: string): Promise<RecipeCollection[]> => {
      const collectionsRef = collection(db, FIREBASE_COLLECTIONS.COLLECTIONS);
      const q = query(collectionsRef, where('ownerId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as RecipeCollection[];
    },

    create: async (
      recipeCollection: Omit<RecipeCollection, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<string> => {
      const collectionsRef = collection(db, FIREBASE_COLLECTIONS.COLLECTIONS);
      const now = Timestamp.now();
      const docRef = await addDoc(collectionsRef, {
        ...recipeCollection,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    },

    update: async (id: string, recipeCollection: Partial<RecipeCollection>): Promise<void> => {
      const collectionRef = doc(db, FIREBASE_COLLECTIONS.COLLECTIONS, id);
      await updateDoc(collectionRef, {
        ...recipeCollection,
        updatedAt: Timestamp.now(),
      });
    },

    delete: async (id: string): Promise<void> => {
      const collectionRef = doc(db, FIREBASE_COLLECTIONS.COLLECTIONS, id);
      await deleteDoc(collectionRef);
    },
  },
};
