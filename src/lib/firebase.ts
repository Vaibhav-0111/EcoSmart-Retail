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

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const isConfigured = true;

export { app, auth, isConfigured };
