// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBdTHao6Ed-rJVqB5XnQER-XRz1h5oHSg0",
  authDomain: "floodet2.firebaseapp.com",
  projectId: "floodet2",
  storageBucket: "floodet2.firebasestorage.app",
  messagingSenderId: "1067351011517",
  appId: "1:1067351011517:web:a5dbbf135249c3ddb507d4",
  measurementId: "G-PRX4FLYV3Z",
};

// Prevent re-initializing on hot reload (Next.js / Vite dev)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Analytics only runs in the browser
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

export { app, analytics };