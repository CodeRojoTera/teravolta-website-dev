import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBflxVL7tirRZVCZrD5xus_jibAiQAy8TI",
    authDomain: "teravolta-41afd.firebaseapp.com",
    projectId: "teravolta-41afd",
    storageBucket: "teravolta-41afd.firebasestorage.app",
    messagingSenderId: "60172356650",
    appId: "1:60172356650:web:b0f23efc1806297fd1c753"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize Firestore (standard)
import { getFirestore } from "firebase/firestore";
const db = getFirestore(app);

export { app, auth, db, storage };
