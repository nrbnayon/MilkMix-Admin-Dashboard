// src/lib/api/client.ts
import { API_CONFIG, HTTP_STATUS } from './config';

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth-token');
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    
    try {
      const data = isJson ? await response.json() : await response.text();
      
      if (response.ok) {
        return {
          data: isJson ? data : { message: data },
          status: response.status,
          success: true,
        };
      }

      // Handle error responses
      const errorMessage = isJson 
        ? data.message || data.error || data.detail || 'An error occurred'
        : data || 'An error occurred';

      return {
        error: errorMessage,
        status: response.status,
        success: false,
      };
    } catch (error) {
      return {
        error: 'Failed to parse response',
        status: response.status,
        success: false,
      };
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
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw new Error(error.message);
      }
      throw new Error('Network error occurred');
    }
  }

  async get<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' }, includeAuth);
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    includeAuth = true
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: 'POST',
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
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  async delete<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' }, includeAuth);
  }

  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    includeAuth = true
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {};
    
    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return this.makeRequest<T>(
      endpoint,
      {
        method: 'POST',
        body: formData,
        headers,
      },
      false // Don't include default headers since we're sending FormData
    );
  }
}

export const apiClient = new ApiClient();