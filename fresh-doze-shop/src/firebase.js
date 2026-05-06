import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Додали Firestore
import { getAuth } from "firebase/auth"; // Додали Auth

const firebaseConfig = {
  apiKey: "AIzaSyC9U8CAF-lW2LzEaAefHC5WISDTcLnbYP8",
  authDomain: "perfume-shop-9f938.firebaseapp.com",
  projectId: "perfume-shop-9f938",
  storageBucket: "perfume-shop-9f938.firebasestorage.app",
  messagingSenderId: "414613260873",
  appId: "1:414613260873:web:602e09faa848bfc37ccd98",
  measurementId: "G-24EFS5DZH5",
};

// Ініціалізуємо Firebase
const app = initializeApp(firebaseConfig);

// Експортуємо сервіси, щоб вони були доступні в App.jsx
export const db = getFirestore(app);
export const auth = getAuth(app);
