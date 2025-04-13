// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDKh4HcP9RCjLp5Edfm5FTRi9jLiI8KiFA",
  authDomain: "electric-bc867.firebaseapp.com",
  projectId: "electric-bc867",
  storageBucket: "electric-bc867.firebasestorage.app",
  messagingSenderId: "312641516378",
  appId: "1:312641516378:web:ed880e1ab80eda9b2ab963",
  measurementId: "G-BKFBZ08JY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
