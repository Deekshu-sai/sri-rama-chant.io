/**
 * Firebase Sync Module
 * Handles authentication, Firestore sync, and data backup/restore
 */

import { getConfig } from './config.js';
import { i18n } from './i18n.js';
import { getTodayString } from './storage.js';

let app = null;
let auth = null;
let db = null;
let firebaseUser = null;
let isInitialized = false;
let syncInProgress = false;

/**
 * Initialize Firebase
 */
export async function initFirebase() {
  if (isInitialized) return { app, auth, db };

  if (!getConfig('features.firebaseSync')) {
    console.log('Firebase sync disabled in config');
    return { app: null, auth: null, db: null };
  }

  try {
    // Dynamic imports for Firebase SDK
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
    const { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js');
    const { getFirestore, doc, setDoc, getDoc, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    const firebaseConfig = getConfig('firebase');

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    isInitialized = true;

    // Set up auth state listener
    onAuthStateChanged(auth, handleAuthStateChanged);

    return { app, auth, db, signInWithPopup, GoogleAuthProvider, signOut, doc, setDoc, getDoc, onSnapshot };
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return { app: null, auth: null, db: null };
  }
}

/**
 * Handle authentication state changes
 */
async function handleAuthStateChanged(user) {
  if (user) {
    firebaseUser = user;
    updateAuthUI(true);
    await syncFromCloud();
  } else {
    firebaseUser = null;
    updateAuthUI(false);
  }
}

/**
 * Update authentication UI
 */
function updateAuthUI(isLoggedIn) {
  const loggedOut = document.getElementById('sync-logged-out');
  const loggedIn = document.getElementById('sync-logged-in');
  const userDisplay = document.getElementById('fb-user-display');

  if (loggedOut && loggedIn && userDisplay) {
    if (isLoggedIn) {
      loggedOut.classList.add('hidden');
      loggedIn.classList.remove('hidden');
      userDisplay.textContent = firebaseUser.displayName || i18n.t('devotee') || 'Devotee';
    } else {
      loggedOut.classList.remove('hidden');
      loggedIn.classList.add('hidden');
    }
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  const firebase = await initFirebase();
  if (!firebase.auth) return false;

  try {
    const { signInWithPopup, GoogleAuthProvider } = firebase;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(firebase.auth, provider);
    return true;
  } catch (error) {
    console.error('Sign in failed:', error);
    showSyncStatus('warn', i18n.t('signInFailed') || 'Sign in failed');
    return false;
  }
}

/**
 * Sign out
 */
export async function signOutUser() {
  const firebase = await initFirebase();
  if (!firebase.auth) return false;

  try {
    const { signOut } = firebase;
    await signOut(firebase.auth);
    return true;
  } catch (error) {
    console.error('Sign out failed:', error);
    return false;
  }
}

/**
 * Get current Firebase user
 */
export function getCurrentUser() {
  return firebaseUser;
}

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
  return !!firebaseUser;
}

/**
 * Sync local data to Firestore
 */
export async function syncToCloud(data) {
  if (!firebaseUser || !db || syncInProgress) return false;

  const firebase = await initFirebase();
  if (!firebase.db) return false;

  syncInProgress = true;
  showSyncStatus('info', i18n.t('syncing') || 'Syncing to cloud...');

  try {
    const { doc, setDoc } = firebase;
    const userDoc = doc(db, 'users', firebaseUser.uid);

    await setDoc(userDoc, {
      ...data,
      lastSynced: new Date()
    }, { merge: true });

    showSyncStatus('ok', i18n.t('syncComplete') || 'Synced to cloud');
    return true;
  } catch (error) {
    console.error('Cloud sync failed:', error);
    showSyncStatus('warn', i18n.t('syncFailed') || 'Sync failed');
    return false;
  } finally {
    syncInProgress = false;
  }
}

/**
 * Sync data from Firestore
 */
export async function syncFromCloud() {
  if (!firebaseUser || !db) return null;

  const firebase = await initFirebase();
  if (!firebase.db) return null;

  try {
    const { doc, getDoc } = firebase;
    const userDoc = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Cloud pull failed:', error);
    return null;
  }
}

/**
 * Merge cloud data with local data
 */
export function mergeCloudData(localData, cloudData) {
  if (!cloudData) return localData;

  const today = getTodayString();
  const merged = { ...localData };

  // Merge history - cloud wins for past days, local wins for today
  if (cloudData.history) {
    merged.history = { ...cloudData.history };
    // Keep today's local count if it's higher
    if (merged.history[today] && localData.todayCount > merged.history[today]) {
      merged.history[today] = localData.todayCount;
    }
  }

  // Merge streak - take the longer streak
  if (cloudData.streak && cloudData.streak.n > (localData.streak?.n || 0)) {
    merged.streak = cloudData.streak;
  }

  // Merge goal
  if (cloudData.currentGoal) {
    merged.goal = cloudData.currentGoal;
  }

  // Merge today's count if cloud date matches today
  if (cloudData.lastSynced) {
    const syncDate = new Date(cloudData.lastSynced.seconds * 1000 || cloudData.lastSynced).toISOString().split('T')[0];
    if (syncDate === today && cloudData.todayCount) {
      merged.todayCount = Math.max(merged.todayCount || 0, cloudData.todayCount);
    }
  }

  merged.history = merged.history || {};
  merged.history[today] = merged.todayCount || 0;

  return merged;
}

/**
 * Show sync status in UI
 */
function showSyncStatus(type, message) {
  const statusEl = document.getElementById('saveStatus');
  if (!statusEl) return;

  statusEl.className = `status-bar status-${type}`;
  statusEl.textContent = message;
}

/**
 * Check if Firebase is initialized
 */
export function isFirebaseReady() {
  return isInitialized && !!db;
}

export default {
  initFirebase,
  signInWithGoogle,
  signOutUser,
  getCurrentUser,
  isLoggedIn,
  syncToCloud,
  syncFromCloud,
  mergeCloudData,
  isFirebaseReady
};