// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDfgsGJoweIaZU_5HiQny4EsKcUd9NBqn8",
  authDomain: "ecosmart-retail.firebaseapp.com",
  projectId: "ecosmart-retail",
  storageBucket: "ecosmart-retail.firebasestorage.app",
  messagingSenderId: "606450531044",
  appId: "1:606450531044:web:ba9fb62aa3742088bdcaf1"
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
