// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBByN-16I67cKA31GZ1NqJ5XSoRLwTK5BE",
  authDomain: "expense-tracker-app-3c4b2.firebaseapp.com",
  projectId: "expense-tracker-app-3c4b2",
  storageBucket: "expense-tracker-app-3c4b2.appspot.com",
  messagingSenderId: "512028837375",
  appId: "1:512028837375:web:b51fc2d96656f8943553ca",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
