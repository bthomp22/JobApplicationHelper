import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config (replace with your actual config from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyB8edmmqkUsTZz5zkOQTVjkb9Otl4flszY",
 // authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "resumebuilderapp-7a8aa",
  storageBucket: "resumebuilderapp-7a8aa.firebasestorage.app",
  messagingSenderId: "621251463146",
  appId: "1:621251463146:ios:3aa7c715fe4d73e9a8d493"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export { db };