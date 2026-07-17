/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps as getFbApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  Firestore 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged, 
  Auth, 
  User 
} from 'firebase/auth';
import { AppItem, Review } from '../types';
import { SEED_APPS } from '../data';

// Operation Types for Error Handler
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Helper to check if Firebase is configured in the environment
// Fallback to user's provided Firebase Project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCBYYj0N_P3_QC-Ysx2xrzgyIr7uO-vTOA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'myselfmkappstore.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'myselfmkappstore',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'myselfmkappstore.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '338232305017',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:338232305017:web:50dc1b44338f7b9a28fba8',
};

const isConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.authDomain
);

let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let auth: Auth | null = null;

if (isConfigured) {
  try {
    if (!getFbApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getFbApps()[0];
    }
    firestore = getFirestore(app);
    auth = getAuth(app);
    console.log('Firebase initialized successfully with config.');
  } catch (error) {
    console.error('Error initializing Firebase SDK:', error);
  }
} else {
  console.log('Firebase awaiting configuration.');
}

// Error Handling Function as required by the Firebase Integration Skill
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentAuth = auth;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.currentUser?.uid || null,
      email: currentAuth?.currentUser?.email || null,
      emailVerified: currentAuth?.currentUser?.emailVerified || null,
      isAnonymous: currentAuth?.currentUser?.isAnonymous || null,
      tenantId: currentAuth?.currentUser?.tenantId || null,
      providerInfo: currentAuth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const isFirebaseActive = (): boolean => isConfigured && firestore !== null;

export const getDbModeLabel = (): string => {
  return isFirebaseActive() 
    ? '🔥 Connected to Live Firebase Firestore' 
    : '⚠️ Firebase Configuration Missing (Please set Secrets)';
};

const TIMEOUT_MS = 4500;

async function withTimeout<T>(promise: Promise<T>, operationName: string): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`TIMEOUT: Firestore operation '${operationName}' timed out.`));
    }, TIMEOUT_MS);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// 1. Fetch All Apps
export const fetchAllApps = async (): Promise<AppItem[]> => {
  if (!isFirebaseActive() || !firestore) {
    const local = localStorage.getItem('marketplace_apps');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return SEED_APPS;
      }
    }
    localStorage.setItem('marketplace_apps', JSON.stringify(SEED_APPS));
    return SEED_APPS;
  }

  const path = 'apps';
  try {
    const appsCol = collection(firestore, path);
    const appSnapshot = await withTimeout(getDocs(appsCol), 'fetchAllApps');
    
    // If the database is completely empty, return the local seed apps
    // to prevent permission errors on public visitors.
    if (appSnapshot.empty) {
      console.log('Firestore is empty. Returning default seed applications portfolio.');
      return SEED_APPS;
    }

    return appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppItem));
  } catch (e) {
    if (e instanceof Error && e.message.includes('TIMEOUT')) {
      console.warn('Firestore fetch timed out. Throwing timeout error to trigger fallback in UI.');
      throw e;
    }
    handleFirestoreError(e, OperationType.LIST, path);
    return [];
  }
};

// Seeding function called explicitly by authenticated Administrators
export const seedDatabase = async (): Promise<void> => {
  if (!isFirebaseActive() || !firestore) {
    throw new Error('Firebase is not configured.');
  }
  console.log('Seeding database with default applications portfolio...');
  const seedPromises = SEED_APPS.map(async (appItem) => {
    const docRef = doc(firestore!, 'apps', appItem.id);
    await setDoc(docRef, appItem);
  });
  await withTimeout(Promise.all(seedPromises), 'seedDatabase');
};

// 2. Fetch Single App by ID
export const fetchAppById = async (id: string): Promise<AppItem | null> => {
  if (!isFirebaseActive() || !firestore) {
    const apps = await fetchAllApps();
    return apps.find(app => app.id === id) || null;
  }

  const path = `apps/${id}`;
  try {
    const docRef = doc(firestore, 'apps', id);
    const docSnap = await withTimeout(getDoc(docRef), 'fetchAppById');
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AppItem;
    }
    return null;
  } catch (e) {
    console.warn(`Firestore getDoc for ${id} failed or timed out. Falling back to local data.`);
    const apps = await fetchAllApps();
    return apps.find(app => app.id === id) || null;
  }
};

// 3. Add a New App
export const createNewApp = async (appData: Omit<AppItem, 'id' | 'reviews' | 'rating' | 'downloads'>): Promise<AppItem> => {
  const newId = appData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `app-${Date.now()}`;
  
  const newApp: AppItem = {
    ...appData,
    id: newId,
    downloads: 0,
    rating: 5.0,
    reviews: [],
  };

  if (!isFirebaseActive() || !firestore) {
    const apps = await fetchAllApps();
    const updatedApps = [newApp, ...apps];
    localStorage.setItem('marketplace_apps', JSON.stringify(updatedApps));
    return newApp;
  }

  const path = `apps/${newId}`;
  try {
    await withTimeout(setDoc(doc(firestore, 'apps', newId), newApp), 'createNewApp');
    return newApp;
  } catch (e) {
    if (e instanceof Error && e.message.includes('TIMEOUT')) {
      throw new Error('Firestore connection timed out. Please check your internet connection or Firestore instance setup.');
    }
    handleFirestoreError(e, OperationType.CREATE, path);
    throw e;
  }
};

// 4. Update an Existing App
export const updateExistingApp = async (id: string, updatedFields: Partial<AppItem>): Promise<boolean> => {
  if (!isFirebaseActive() || !firestore) {
    const apps = await fetchAllApps();
    const updatedApps = apps.map(app => app.id === id ? { ...app, ...updatedFields } : app);
    localStorage.setItem('marketplace_apps', JSON.stringify(updatedApps));
    return true;
  }

  const path = `apps/${id}`;
  try {
    const docRef = doc(firestore, 'apps', id);
    // Use setDoc with merge: true instead of updateDoc to support both existing and unseeded apps
    await withTimeout(setDoc(docRef, updatedFields, { merge: true }), 'updateExistingApp');
    return true;
  } catch (e) {
    if (e instanceof Error && e.message.includes('TIMEOUT')) {
      throw new Error('Firestore connection timed out. Could not complete update.');
    }
    handleFirestoreError(e, OperationType.UPDATE, path);
    return false;
  }
};

// 5. Delete an App
export const deleteAppById = async (id: string): Promise<boolean> => {
  if (!isFirebaseActive() || !firestore) {
    const apps = await fetchAllApps();
    const updatedApps = apps.filter(app => app.id !== id);
    localStorage.setItem('marketplace_apps', JSON.stringify(updatedApps));
    return true;
  }

  const path = `apps/${id}`;
  try {
    const docRef = doc(firestore, 'apps', id);
    await withTimeout(deleteDoc(docRef), 'deleteAppById');
    return true;
  } catch (e) {
    if (e instanceof Error && e.message.includes('TIMEOUT')) {
      throw new Error('Firestore connection timed out. Could not complete deletion.');
    }
    handleFirestoreError(e, OperationType.DELETE, path);
    return false;
  }
};

// 6. Add a Review
export const addAppReview = async (appId: string, review: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  const newReview: Review = {
    ...review,
    id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    date: new Date().toISOString().split('T')[0]
  };

  const currentApp = await fetchAppById(appId);
  if (!currentApp) throw new Error('App not found');

  const updatedReviews = [newReview, ...currentApp.reviews];
  const totalRatingSum = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
  const newRating = parseFloat((totalRatingSum / updatedReviews.length).toFixed(1));

  await updateExistingApp(appId, {
    reviews: updatedReviews,
    rating: newRating
  });

  return newReview;
};

// ==========================================
// AUTHENTICATION API
// ==========================================

export const subscribeToAuth = (callback: (user: any | null) => void) => {
  if (isConfigured && auth) {
    return onAuthStateChanged(auth, callback);
  } else {
    // No-op subscription when Firebase is not active
    callback(null);
    return () => {};
  }
};

export const adminLogin = async (email: string, password: string): Promise<any> => {
  if (isConfigured && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    } catch (e: any) {
      const errCode = e?.code || '';
      const errMsg = e?.message || String(e);
      
      // If Email/Password auth is not configured in the Firebase Console
      if (errCode === 'auth/configuration-not-found' || errMsg.includes('configuration-not-found')) {
        console.warn('Firebase Auth: Email/Password provider not enabled in console. Checking for local fallback...');
        if (email === 'admin@myselfmk.com' && password === 'password123') {
          return {
            uid: 'mock-admin-fallback',
            email: 'admin@myselfmk.com',
            displayName: 'Admin (Local Fallback)',
            isFallback: true
          };
        } else {
          throw new Error(
            'Firebase Authentication error: The "Email/Password" sign-in provider is not enabled in your Firebase Console.\n\n' +
            'To fix this:\n' +
            '1. Go to your Firebase Console -> Authentication -> Sign-in method.\n' +
            '2. Click "Add new provider" and select "Email/Password".\n' +
            '3. Turn on "Enable" and click Save.\n\n' +
            '(Alternatively, you can log in right now using the default demo credentials: admin@myselfmk.com / password123)'
          );
        }
      }

      // Try on-the-fly auto-registration if user does not exist in the new instance yet
      if (errCode === 'auth/user-not-found' || errCode === 'auth/invalid-credential' || errMsg.includes('user-not-found') || errMsg.includes('invalid-credential')) {
        try {
          console.log(`User not found or credentials invalid. Attempting on-the-fly registration for ${email}...`);
          const newCred = await createUserWithEmailAndPassword(auth, email, password);
          return newCred.user;
        } catch (regErr: any) {
          const regCode = regErr?.code || '';
          // If the email is actually already registered, it means the user existed but they put the WRONG password
          if (regCode === 'auth/email-already-in-use' || regErr?.message?.includes('already-in-use')) {
            throw new Error('Incorrect password for this registered Administrator account.');
          }
          // Otherwise, re-throw the original error or registration error
          throw new Error(`Authentication failed: ${errMsg}. (Registration error: ${regErr?.message || regErr})`);
        }
      }
      
      // Re-throw any other errors (e.g. invalid password, user-not-found)
      throw e;
    }
  } else {
    // Local demo login fallback when Firebase is not active
    if (email === 'admin@myselfmk.com' && password === 'password123') {
      return {
        uid: 'demo-admin',
        email: 'admin@myselfmk.com',
        displayName: 'Demo Admin'
      };
    }
    throw new Error('Invalid credentials. Use the demo account: admin@myselfmk.com / password123');
  }
};

export const adminLogout = async (): Promise<void> => {
  if (isConfigured && auth) {
    await signOut(auth);
  }
};
