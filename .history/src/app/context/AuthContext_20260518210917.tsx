import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  notifications: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGmail: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    notifications: boolean
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateNotificationPreference: (enabled: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else if (firebaseUser.email === 'admin@hydrix.com') {
            const adminUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: 'Admin',
              role: 'admin',
              notifications: true
            };

            setUser(adminUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const loginWithGmail = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'Gmail User',
          role: 'user',
          notifications: true
        };

        await setDoc(userRef, newUser);
        setUser(newUser);
      }
    } catch (error) {
      console.error('Gmail login failed:', error);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    notifications: boolean
  ): Promise<boolean> => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser: User = {
        id: result.user.uid,
        email,
        name,
        role: 'user',
        notifications
      };

      await setDoc(doc(db, 'users', result.user.uid), newUser);

      setUser(newUser);

      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateNotificationPreference = async (
    enabled: boolean
  ): Promise<void> => {
    try {
      if (!user) return;

      const updatedUser = {
        ...user,
        notifications: enabled
      };

      setUser(updatedUser);

      await setDoc(doc(db, 'users', user.id), updatedUser);
    } catch (error) {
      console.error('Update notification failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGmail,
        signup,
        logout,
        updateNotificationPreference
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}