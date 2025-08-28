// src/lib/middleware-client.ts
"use client";

/**
 * Client-side helper utilities to work with middleware authentication
 * This ensures proper communication between client localStorage tokens and middleware
 */

import { AuthAPI } from "@/lib/api/auth";

export class MiddlewareClient {
  /**
   * Set authentication headers for requests to help middleware identify authenticated users
   * This should be called on app initialization and after login/logout
   */
  static setAuthHeaders() {
    if (typeof window === "undefined") return;

    const token = AuthAPI.getStoredToken();

    if (token) {
      // Set a meta tag that can be read by middleware on next page load
      let metaToken = document.querySelector(
        'meta[name="auth-token"]'
      ) as HTMLMetaElement;
      if (!metaToken) {
        metaToken = document.createElement("meta");
        metaToken.name = "auth-token";
        document.head.appendChild(metaToken);
      }
      metaToken.content = token;

      // Set cookie for middleware to read (as fallback)
      document.cookie = `auth-token=${token}; path=/; samesite=strict; ${
        window.location.protocol === "https:" ? "secure;" : ""
      }`;
    } else {
      // Clear auth indicators
      const metaToken = document.querySelector('meta[name="auth-token"]');
      if (metaToken) {
        metaToken.remove();
      }

      // Clear auth cookie
      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=strict;";
    }
  }

  /**
   * Clear authentication indicators
   * Call this on logout
   */
  static clearAuthHeaders() {
    if (typeof window === "undefined") return;

    // Remove meta tag
    const metaToken = document.querySelector('meta[name="auth-token"]');
    if (metaToken) {
      metaToken.remove();
    }

    // Clear cookie
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; samesite=strict;";
  }

  /**
   * Check if current route requires authentication
   */
  static isProtectedRoute(pathname: string): boolean {
    const protectedRoutes = [
      "/overview",
      "/profile",
      "/settings",
      "/manage-ads",
      "/manage-users",
      "/users-subscription",
      "/notifications",
      "/support",
    ];

    return protectedRoutes.some((route) => {
      return pathname === route || pathname.startsWith(route + "/");
    });
  }

  /**
   * Check if current route is an auth route
   */
  static isAuthRoute(pathname: string): boolean {
    const authRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/reset-success",
      "/verify-otp",
      "/success",
    ];

    return authRoutes.some((route) => {
      return pathname === route || pathname.startsWith(route + "/");
    });
  }

  /**
   * Handle client-side route protection
   * Call this in your route components or layout
   */
  static handleRouteProtection(pathname: string) {
    if (typeof window === "undefined") return;

    const isAuthenticated = !!AuthAPI.getStoredToken();
    const isProtected = this.isProtectedRoute(pathname);
    const isAuth = this.isAuthRoute(pathname);

    // Update auth headers based on current state
    this.setAuthHeaders();

    // Handle redirects that middleware might miss
    if (isProtected && !isAuthenticated) {
      const loginUrl = new URL("/login", window.location.origin);
      loginUrl.searchParams.set("redirect", pathname);
      window.location.href = loginUrl.toString();
      return;
    }

    if (isAuth && isAuthenticated) {
      window.location.href = "/overview";
      return;
    }
  }

  /**
   * Initialize middleware client
   * Call this in your root layout or app component
   */
  static initialize() {
    if (typeof window === "undefined") return;

    // Set initial auth headers
    this.setAuthHeaders();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener("storage", (e) => {
      if (e.key === "auth-token") {
        this.setAuthHeaders();

        // Handle cross-tab authentication sync
        const currentPath = window.location.pathname;

        if (e.newValue === null) {
          // Logged out in another tab
          if (this.isProtectedRoute(currentPath)) {
            window.location.href = "/login";
          }
        } else {
          // Logged in in another tab
          if (this.isAuthRoute(currentPath)) {
            window.location.href = "/overview";
          }
        }
      }
    });

    // Handle auth state on page load
    this.handleRouteProtection(window.location.pathname);
  }

  /**
   * Custom fetch wrapper that includes auth headers for API calls
   */
  static async fetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = AuthAPI.getStoredToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["X-Auth-Token"] = token;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }

  /**
   * Check if token is expired and handle refresh
   */
  static async checkAndRefreshToken(): Promise<boolean> {
    const token = AuthAPI.getStoredToken();
    const refreshToken = AuthAPI.getStoredRefreshToken();

    if (!token || !refreshToken) {
      return false;
    }

    try {
      // Check if token is expired or will expire soon
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - currentTime;

      // If token expires in less than 5 minutes, refresh it
      if (timeUntilExpiry < 300) {
        // Call refresh endpoint (you'll need to implement this in your API)
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          // Update tokens
          localStorage.setItem("auth-token", data.access_token);
          localStorage.setItem("refresh-token", data.refresh_token);
          this.setAuthHeaders();
          return true;
        } else {
          // Refresh failed, logout user
          AuthAPI.logout();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      AuthAPI.logout();
      return false;
    }
  }
}

// Auto-initialize when imported (for convenience)
if (typeof window !== "undefined") {
  // Initialize after DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      MiddlewareClient.initialize();
    });
  } else {
    MiddlewareClient.initialize();
  }
}
