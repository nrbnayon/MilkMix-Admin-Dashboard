// src/contexts/AuthContext.tsx
"use client";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthAPI } from "@/lib/api/auth";
import { MiddlewareClient } from "@/lib/middleware-client";
import type { User, LoginRequest, RegisterRequest } from "@/types/api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
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

  const isAuthenticated = !!user && !!AuthAPI.getStoredToken();
  const isAdmin = user?.role === "admin";

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
            // Update middleware headers
            MiddlewareClient.setAuthHeaders();
          } else {
            // Token is invalid, clear storage
            AuthAPI.logout();
            MiddlewareClient.clearAuthHeaders();
          }
        } else {
          // No token or user, ensure headers are clear
          MiddlewareClient.clearAuthHeaders();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        AuthAPI.logout();
        MiddlewareClient.clearAuthHeaders();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up periodic token refresh check
    const refreshInterval = setInterval(() => {
      MiddlewareClient.checkAndRefreshToken();
    }, 4 * 60 * 1000); // Check every 4 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthAPI.login(credentials);

      if (response.success && response.data) {
        const profileData = response.data.profile;

        // Create user object that matches the structure returned by getProfile()
        const normalizedUser: User = {
          id:
            typeof response.data.profile?.id === "number"
              ? response.data.profile.id
              : 0,
          name: profileData?.name ?? "",
          email: credentials.email,
          role: response.data.role as User["role"],
          is_verified: response.data.is_verified,
          user_profile: {
            name: profileData?.name,
            phone_number: profileData?.phone_number,
            profile_picture: profileData?.profile_picture,
          },
        };
        setUser(normalizedUser);

        // Store the normalized user data
        localStorage.setItem("user", JSON.stringify(normalizedUser));

        // Update middleware headers after successful login
        MiddlewareClient.setAuthHeaders();

        toast.success("Login successful!", {
          description: `Welcome back, ${normalizedUser.user_profile?.name}!`,
        });
        return true;
      } else {
        // Clear headers on failed login
        MiddlewareClient.clearAuthHeaders();
        toast.error("Login failed", {
          description: response.error || "Invalid credentials",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      MiddlewareClient.clearAuthHeaders();
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Network error",
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
        toast.success("Registration successful!", {
          description: "Please check your email to verify your account.",
        });
        return true;
      } else {
        toast.error("Registration failed", {
          description: response.error || "Please try again",
        });
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description: error instanceof Error ? error.message : "Network error",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    AuthAPI.logout();
    MiddlewareClient.clearAuthHeaders();
    toast.info("Logged out successfully");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      // Update headers to reflect any changes
      MiddlewareClient.setAuthHeaders();
    }
  };

  const refreshUser = async () => {
    try {
      const response = await AuthAPI.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        MiddlewareClient.setAuthHeaders();
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // If refresh fails, might need to logout
      if (error instanceof Error && error.message.includes("401")) {
        logout();
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
