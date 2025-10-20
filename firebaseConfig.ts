// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBOJ_T38oTpIs4pViBKx_hYKLcQy0qNWVo",
  authDomain: "markitdown-6da8b.firebaseapp.com",
  projectId: "markitdown-6da8b",
  storageBucket: "markitdown-6da8b.firebasestorage.app",
  messagingSenderId: "1081609594025",
  appId: "1:1081609594025:web:79bfa97ae6a4bc2c16f5b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});