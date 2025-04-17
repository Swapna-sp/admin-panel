// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAPxEIlhnk50q6MUDkgybSSL0HJTaeNNlI",
  authDomain: "fir-hosting-2a037.firebaseapp.com",
  projectId: "fir-hosting-2a037",
  storageBucket: "fir-hosting-2a037.firebasestorage.app",
  messagingSenderId: "466788283734",
  appId: "1:466788283734:web:e4fa8dd906a3e2da5552f7",
};

// ✅ Prevent re-initialization in dev/hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
