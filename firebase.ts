import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAILechlu8G87LNMoc6rMarg5T12dT8OSs",
  authDomain: "task-manager-75658.firebaseapp.com",
  projectId: "task-manager-75658",
  storageBucket: "task-manager-75658.firebasestorage.app",
  messagingSenderId: "591551618029",
  appId: "1:591551618029:web:ce21b95464b7d9b8d3a5e4"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
