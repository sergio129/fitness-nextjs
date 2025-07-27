"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { apiClient } from '@/utils/api';

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  admin: Admin | null;
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
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedAdmin = localStorage.getItem('admin');
        
        if (token && storedAdmin) {
          try {
            // Verificar token con el servidor
            await apiClient.request('/auth/verify');
            const adminData = JSON.parse(storedAdmin);
            setAdmin(adminData);
          } catch (verificationError) {
            // Token inválido, limpiar storage
            console.warn('Token verification failed:', verificationError);
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
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
      localStorage.setItem('admin', JSON.stringify(response.admin));
      setAdmin(response.admin);
    } catch (loginError) {
      console.error('Login failed:', loginError);
      throw loginError;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    window.location.href = '/login';
  };

  const isAuthenticated = !!admin && !!localStorage.getItem('token');

  const value: AuthContextType = useMemo(() => ({
    admin,
    isLoading,
    login,
    logout,
    isAuthenticated,
  }), [admin, isLoading, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
