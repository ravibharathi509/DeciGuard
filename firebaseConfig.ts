// Import the functions you need from the SDKs you need
import { getDatabase } from "firebase/database";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const db = getDatabase(app);