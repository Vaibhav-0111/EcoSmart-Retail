// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;

// Check if all required environment variables are present
const isConfigured = Object.values(firebaseConfig).every(Boolean);

if (!getApps().length) {
  if (isConfigured) {
    app = initializeApp(firebaseConfig);
  } else {
    // We don't log an error here to avoid cluttering the console.
    // The AuthProvider and LoginPage will handle notifying the user.
    app = {} as FirebaseApp;
  }
} else {
  app = getApp();
}

// Conditionally get auth instance
const auth = isConfigured ? getAuth(app) : null;

export { app, auth, isConfigured };
