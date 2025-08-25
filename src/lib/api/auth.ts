// src/lib/api/auth.ts
import { apiClient } from "./client";
import { API_CONFIG } from "./config";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  ProfileUpdateRequest,
  OTPRequest,
  OTPVerifyRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  PasswordChangeRequest,
} from "@/types/api";

export class AuthAPI {
  static async login(credentials: LoginRequest) {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials,
      false // Don't include auth header for login
    );

    if (response.success && response.data) {
      // Store tokens with correct property names
      localStorage.setItem("auth-token", response.data.access_token);
      localStorage.setItem("refresh-token", response.data.refresh_token);

      // Create user object with all necessary properties
      const userData = {
        ...response.data,
        id: response.data.profile?.user || response.data.profile?.id,
        name: response.data.profile?.name,
        email: credentials.email, // Add email from credentials
      };

      localStorage.setItem("user", JSON.stringify(userData));
    }

    return response;
  }

  static async register(userData: RegisterRequest) {
    return apiClient.post<RegisterResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData,
      false // Don't include auth header for registration
    );
  }

  static async getProfile() {
    return apiClient.get<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  }

  static async updateProfile(data: ProfileUpdateRequest) {
    const formData = new FormData();

    if (data.first_name) formData.append("first_name", data.first_name);
    if (data.last_name) formData.append("last_name", data.last_name);
    if (data.phone_number) formData.append("phone_number", data.phone_number);
    if (data.profile_picture)
      formData.append("profile_picture", data.profile_picture);

    return apiClient.postFormData<User>(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE,
      formData
    );
  }

  static async getAllUsers() {
    return apiClient.get<User[]>(API_CONFIG.ENDPOINTS.AUTH.ALL_USERS);
  }

  static async createOTP(data: OTPRequest) {
    return apiClient.post(API_CONFIG.ENDPOINTS.AUTH.OTP_CREATE, data, false);
  }

  static async verifyOTP(data: OTPVerifyRequest) {
    return apiClient.post(API_CONFIG.ENDPOINTS.AUTH.OTP_VERIFY, data, false);
  }

  static async requestPasswordReset(data: PasswordResetRequest) {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST,
      data,
      false
    );
  }

  static async confirmPasswordReset(data: PasswordResetConfirmRequest) {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM,
      data,
      false
    );
  }

  static async changePassword(data: PasswordChangeRequest) {
    return apiClient.post(API_CONFIG.ENDPOINTS.AUTH.PASSWORD_CHANGE, data);
  }

  static async verifyResetOTP(data: OTPVerifyRequest) {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.AUTH.RESET_OTP_VERIFY,
      data,
      false
    );
  }

  static logout() {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("user");
    // Only redirect if we're in the browser
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  static getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  }

  static getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth-token");
  }

  static getStoredRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh-token");
  }

  static isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  static hasRole(requiredRole: string): boolean {
    const user = this.getStoredUser();
    return user?.role === requiredRole;
  }

  static isAdmin(): boolean {
    return this.hasRole("admin");
  }
}
