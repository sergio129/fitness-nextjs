"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { apiClient } from '@/utils/api';


interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        // Verificar token con el servidor
        await apiClient.request('/auth/verify');
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (verificationError) {
        // Token inválido, limpiar storage
        console.warn('Token verification failed:', verificationError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: any = await apiClient.login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (loginError) {
      console.error('Login failed:', loginError);
      throw loginError;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isAuthenticated = !!user && !!localStorage.getItem('token');

  const value: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
  }), [user, isLoading, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
