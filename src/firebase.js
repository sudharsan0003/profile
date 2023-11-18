import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBjagYhHJZiCzM7YUTTPdtXHFT4P8vts-A',
  authDomain: 'profile-6b58a.firebaseapp.com',
  projectId: 'profile-6b58a',
  storageBucket: 'profile-6b58a.appspot.com',
  messagingSenderId: '777278415499',
  appId: '1:777278415499:web:0c934bcf1f0b4577c76a8e',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
