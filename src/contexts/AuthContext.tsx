// src/contexts/AuthContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthAPI } from '@/lib/api/auth';
import type { User, LoginRequest, RegisterRequest } from '@/types/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user && !!AuthAPI.getStoredToken();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = AuthAPI.getStoredToken();
        const storedUser = AuthAPI.getStoredUser();

        if (token && storedUser) {
          // Verify token is still valid by fetching profile
          const response = await AuthAPI.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token is invalid, clear storage
            AuthAPI.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        AuthAPI.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthAPI.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success('Login successful!', {
          description: `Welcome back, ${response.data.user.name}!`,
        });
        return true;
      } else {
        toast.error('Login failed', {
          description: response.error || 'Invalid credentials',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'Network error',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthAPI.register(userData);
      
      if (response.success) {
        toast.success('Registration successful!', {
          description: 'Please check your email to verify your account.',
        });
        return true;
      } else {
        toast.error('Registration failed', {
          description: response.error || 'Please try again',
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed', {
        description: error instanceof Error ? error.message : 'Network error',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    AuthAPI.logout();
    toast.info('Logged out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    try {
      const response = await AuthAPI.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}