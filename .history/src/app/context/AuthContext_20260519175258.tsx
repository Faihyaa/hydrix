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
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

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
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGmail: () => Promise<void>;
  signup: (email: string, password: string, name: string, notifications: boolean) => Promise<boolean>;
  logout: () => void;
  updateNotificationPreference: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('🔐 Firebase user found:', firebaseUser.email);
          
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            console.log('📄 User from Firestore:', userData);
            setUser(userData);
          } else if (firebaseUser.email === 'admin@hydrix.com') {
            // Create admin user if doesn't exist
            const adminUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: 'Admin',
              role: 'Admin',
              notifications: true
            };
            console.log('👨‍💼 Creating admin user:', adminUser);
            await setDoc(doc(db, 'users', firebaseUser.uid), adminUser);
            setUser(adminUser);
          } else {
            // User has no Firestore document and is not admin
            console.log('⚠️ User has no Firestore document and is not admin');
            setUser(null);
          }
        } else {
          console.log('❌ No Firebase user');
          setUser(null);
        }
      } catch (err) {
        console.error("Auth error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful:', result.user.email);
      return true;
    } catch (error) {
      console.error('❌ Login failed:', error);
      return false;
    }
  };

  const loginWithGmail = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || 'Gmail User',
          role: 'User',
          notifications: true
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        setUser(newUser);
        console.log('✅ Gmail user created:', newUser);
      }
    } catch (error) {
      console.error('❌ Gmail login failed:', error);
    }
  };

  const signup = async (email: string, password: string, name: string, notifications: boolean): Promise<boolean> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: User = {
        id: result.user.uid,
        email,
        name,
        role: 'User',
        notifications
      };
      await setDoc(doc(db, 'users', result.user.uid), newUser);
      setUser(newUser);
      console.log('✅ Signup successful:', newUser);
      return true;
    } catch (error) {
      console.error('❌ Signup failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  const updateNotificationPreference = async (enabled: boolean) => {
    if (user) {
      const updatedUser = { ...user, notifications: enabled };
      setUser(updatedUser);
      await setDoc(doc(db, 'users', user.id), updatedUser);
      console.log('✅ Notification preference updated:', enabled);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGmail, signup, logout, updateNotificationPreference }}>
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