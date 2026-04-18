import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAcgyf2cl70YNlv_RHwDEEM_g8g2ql3Ckc',
  authDomain: 'parcial2-c9e01.firebaseapp.com',
  projectId: 'parcial2-c9e01',
  storageBucket: 'parcial2-c9e01.firebasestorage.app',
  messagingSenderId: '498845592988',
  appId: '1:498845592988:web:beb4435900f0995b576c59',
  measurementId: 'G-NS12580XQK',
};

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getDb() {
  return getFirestore(getFirebaseApp());
}
