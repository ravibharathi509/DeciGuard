// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyD92TKAaK4l1a1Cufgrl71yC3-NNjQEmQ4",
  authDomain: "deciguard-be7a1.firebaseapp.com",
  databaseURL: "https://deciguard-be7a1-default-rtdb.firebaseio.com",
  projectId: "deciguard-be7a1",
  storageBucket: "deciguard-be7a1.firebasestorage.app",
  messagingSenderId: "408364176780",
  appId: "1:408364176780:web:6839ed5bf95068321a32a9",
  measurementId: "G-9NT7367VH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getDatabase(app);        
export const firestore = getFirestore(app); // Universal Logic-ku idhu dhaan main