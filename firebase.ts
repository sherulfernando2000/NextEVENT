import { initializeApp , getApps } from "firebase/app"
import { initializeAuth, getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
  apiKey: "AIzaSyAILechlu8G87LNMoc6rMarg5T12dT8OSs",
  authDomain: "task-manager-75658.firebaseapp.com",
  projectId: "task-manager-75658",
  storageBucket: "task-manager-75658.firebasestorage.app",
  messagingSenderId: "591551618029",
  appId: "1:591551618029:web:ce21b95464b7d9b8d3a5e4"
};

// const app = initializeApp(firebaseConfig)

// export const auth = getAuth(app)
// export const db = getFirestore(app)

// Initialize Firebase
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth with AsyncStorage persistence
let app;
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
  
  try {
    // Try with custom options for React Native
    auth = initializeAuth(app, {
      // Remove persistence config - let Firebase handle it
    })
  } catch (error) {
    // If initializeAuth fails (rare), fall back to getAuth
    auth = getAuth(app)
  }
} else {
  app = getApps()[0]
  auth = getAuth(app)
}

// Initialize other Firebase services
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;