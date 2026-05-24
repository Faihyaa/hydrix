import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

interface User {
  id: string;
  email: string;
  name: string;
  role: 'User' | 'Admin';
  notifications: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithGmail: () => Promise<void>;
  signup: (email: string, password: string, name: string, notifications: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  updateNotificationPreference: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function saveUserToFirestore(uid: string, data: {
  email: string;
  name: string;
  role: string;
  notifications: boolean;
}) {
  await setDoc(doc(firestore, 'users', uid), {
    email: data.email,
    name: data.name,
    role: data.role,
    alertEnabled: data.notifications,
    createdAt: Date.now(),
  }, { merge: true });

  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid,
        email: data.email,
        name: data.name,
        notifications: data.notifications,
      }),
    });
  } catch (err) {
    console.warn('Backend register failed:', err);
  }
}

async function getUserFromFirestore(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(firestore, 'users', uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: uid,
    email: d.email,
    name: d.name,
    role: d.role === 'Admin' ? 'Admin' : 'User',
    notifications: d.alertEnabled ?? true,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserFromFirestore(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserFromFirestore(cred.user.uid);
      setUser(userData);
      return userData;
    } catch (err: any) {
      console.error('Login failed:', err.message);
      return null;
    }
  };

  const loginWithGmail = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const uid = cred.user.uid;
    const existing = await getUserFromFirestore(uid);
    if (!existing) {
      await saveUserToFirestore(uid, {
        email: cred.user.email!,
        name: cred.user.displayName || 'User',
        role: 'User',
        notifications: true,
      });
    }
    const userData = await getUserFromFirestore(uid);
    setUser(userData);
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    notifications: boolean
  ): Promise<boolean> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await saveUserToFirestore(cred.user.uid, {
        email, name, role: 'User', notifications,
      });
      const userData = await getUserFromFirestore(cred.user.uid);
      setUser(userData);
      return true;
    } catch (err: any) {
      console.error('Signup failed:', err.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };

  const updateNotificationPreference = async (enabled: boolean) => {
    if (!user) return;
    await updateDoc(doc(firestore, 'users', user.id), { alertEnabled: enabled });
    setUser({ ...user, notifications: enabled });
  };

  return (
    <AuthContext.Provider value={{
      user, loading, login, loginWithGmail, signup, logout, updateNotificationPreference
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}