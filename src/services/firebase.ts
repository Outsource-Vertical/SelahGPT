import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { ENV } from "@utils/env";
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  getReactNativePersistence,
} from "firebase/auth";

// Firebase config from environment
const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Basic auth (no advanced persistence logic)
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db };
