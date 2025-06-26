// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ2qfhVWjJuyDp67kftMm4jgCNzF-yB80",
  authDomain: "farmstock-e6ef6.firebaseapp.com",
  projectId: "farmstock-e6ef6",
  storageBucket: "farmstock-e6ef6.firebasestorage.app",
  messagingSenderId: "318794453995",
  appId: "1:318794453995:web:8b7d535617264ec4597fae",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
