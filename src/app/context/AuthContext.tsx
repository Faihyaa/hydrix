import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  notifications: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGmail: () => Promise<void>;
  signup: (email: string, password: string, name: string, notifications: boolean) => Promise<boolean>;
  logout: () => void;
  updateNotificationPreference: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('floodet_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - check against stored users
    const users = JSON.parse(localStorage.getItem('floodet_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        notifications: foundUser.notifications
      };
      setUser(userData);
      localStorage.setItem('floodet_user', JSON.stringify(userData));
      return true;
    }
    
    // Default admin account
    if (email === 'admin@floodet.com' && password === 'admin123') {
      const adminUser = {
        id: 'admin',
        email: 'admin@floodet.com',
        name: 'Admin',
        role: 'admin' as const,
        notifications: true
      };
      setUser(adminUser);
      localStorage.setItem('floodet_user', JSON.stringify(adminUser));
      return true;
    }
    
    return false;
  };

  const loginWithGmail = async () => {
    // Mock Gmail login
    const mockGmailUser = {
      id: 'gmail_' + Date.now(),
      email: 'user@gmail.com',
      name: 'Gmail User',
      role: 'user' as const,
      notifications: true
    };
    setUser(mockGmailUser);
    localStorage.setItem('floodet_user', JSON.stringify(mockGmailUser));
  };

  const signup = async (email: string, password: string, name: string, notifications: boolean): Promise<boolean> => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('floodet_users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    // Create new user
    const newUser = {
      id: 'user_' + Date.now(),
      email,
      password,
      name,
      role: 'user' as const,
      notifications
    };

    users.push(newUser);
    localStorage.setItem('floodet_users', JSON.stringify(users));

    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      notifications: newUser.notifications
    };
    setUser(userData);
    localStorage.setItem('floodet_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('floodet_user');
  };

  const updateNotificationPreference = (enabled: boolean) => {
    if (user) {
      const updatedUser = { ...user, notifications: enabled };
      setUser(updatedUser);
      localStorage.setItem('floodet_user', JSON.stringify(updatedUser));
      
      // Update in users list too
      const users = JSON.parse(localStorage.getItem('floodet_users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, notifications: enabled } : u
      );
      localStorage.setItem('floodet_users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGmail, signup, logout, updateNotificationPreference }}>
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
