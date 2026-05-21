import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'User' | 'Admin';
  notifications: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  loginWithGmail: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    notifications: boolean
  ) => Promise<boolean>;
  logout: () => void;
  updateNotificationPreference: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const normalizeRole = (role: string) =>
    role.toLowerCase() === 'admin' ? 'Admin' : 'User';

  // Load user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('hydrix_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser({
        ...parsedUser,
        role: normalizeRole(parsedUser.role || 'user')
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    // Core admin
    if (email === 'admin@hydrix.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin',
        email: 'admin@hydrix.com',
        name: 'Core Admin',
        role: 'Admin',
        notifications: true
      };

      setUser(adminUser);
      localStorage.setItem('hydrix_user', JSON.stringify(adminUser));
      return adminUser;
    }

    // Normal users
    const users = JSON.parse(localStorage.getItem('hydrix_users') || '[]');

    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!foundUser) return null;

    const userData: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      role: normalizeRole(foundUser.role || 'user'),
      notifications: foundUser.notifications
    };

    setUser(userData);
    localStorage.setItem('hydrix_user', JSON.stringify(userData));

    return userData;
  };

  const loginWithGmail = async () => {
    const mockGmailUser: User = {
      id: 'gmail_' + Date.now(),
      email: 'user@gmail.com',
      name: 'Gmail User',
      role: 'User',
      notifications: true
    };

    setUser(mockGmailUser);
    localStorage.setItem('hydrix_user', JSON.stringify(mockGmailUser));
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    notifications: boolean
  ): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('hydrix_users') || '[]');

    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: 'user_' + Date.now(),
      email,
      password,
      name,
      role: 'User' as const,
      notifications
    };

    users.push(newUser);
    localStorage.setItem('hydrix_users', JSON.stringify(users));

    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      notifications: newUser.notifications
    };

    setUser(userData);
    localStorage.setItem('hydrix_user', JSON.stringify(userData));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hydrix_user');
  };

  const updateNotificationPreference = (enabled: boolean) => {
    if (!user) return;

    const updatedUser = { ...user, notifications: enabled };

    setUser(updatedUser);
    localStorage.setItem('hydrix_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('hydrix_users') || '[]');

    const updatedUsers = users.map((u: any) =>
      u.id === user.id ? { ...u, notifications: enabled } : u
    );

    localStorage.setItem('hydrix_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}