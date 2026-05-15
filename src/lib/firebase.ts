import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBdTHao6Ed-rJVqB5XnQER-XRz1h5oHSg0",
  authDomain: "floodet2.firebaseapp.com",
  projectId: "floodet2",
  storageBucket: "floodet2.firebasestorage.app",
  messagingSenderId: "1067351011517",
  appId: "1:1067351011517:web:a5dbbf135249c3ddb507d4",
  measurementId: "G-PRX4FLYV3Z",
  databaseURL: "https://floodet2-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null));

export { app, auth, db, database, ref, set, onValue, analytics };