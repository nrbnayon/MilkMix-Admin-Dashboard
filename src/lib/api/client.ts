// src/lib/api/client.ts
import { ApiError } from "@/types/apiError";
import { API_CONFIG } from "./config";

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
  success: boolean;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth-token");
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");

    try {
      const data = isJson ? await response.json() : await response.text();

      if (response.ok) {
        return {
          data: isJson ? data : { message: data },
          status: response.status,
          success: true,
        };
      }

      // Handle error responses - Create error object and throw it
      const errorMessage = isJson
        ? data.message || data.error || data.detail || "An error occurred"
        : data || "An error occurred";

      // Create a custom error object with response details
      const apiError = new ApiError(errorMessage, {
        data,
        status: response.status,
        statusText: response.statusText,
      });

      // Throw the error instead of returning error response
      throw apiError;
    } catch (error) {
      // If it's already our custom ApiError, re-throw it
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle JSON parsing errors
      console.error("Error parsing response:", error);
      const parseError = new ApiError("Failed to parse response", {
        data: null,
        status: response.status,
        statusText: response.statusText,
      });
      throw parseError;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(includeAuth),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      // Handle network and timeout errors
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        // If it's our custom ApiError, re-throw it
        if (error instanceof ApiError) {
          throw error;
        }
        throw new Error(error.message);
      }
      throw new Error("Network error occurred");
    }
  }

  async get<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "GET" }, includeAuth);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  async delete<T>(
    endpoint: string,
    includeAuth = true
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: "DELETE" }, includeAuth);
  }

  // CORRECTED: Fixed method for FormData requests
  async putFormData<T>(
    endpoint: string,
    formData: FormData,
    includeAuth = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Create headers without Content-Type - let browser set it for FormData
    const headers: HeadersInit = {};

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      method: "PUT", // Changed from POST to PUT
      body: formData,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      // Handle network and timeout errors
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        // If it's our custom ApiError, re-throw it
        if (error instanceof ApiError) {
          throw error;
        }
        throw new Error(error.message);
      }
      throw new Error("Network error occurred");
    }
  }

  // Keep the old method for backward compatibility but renamed
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    includeAuth = true
  ): Promise<ApiResponse<T>> {
    return this.putFormData<T>(endpoint, formData, includeAuth);
  }
}

export const apiClient = new ApiClient();
