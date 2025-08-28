// types/apiError.ts
export interface ApiErrorResponse {
  data: string | unknown;
  status: number;
  statusText: string;
}

export class ApiError extends Error {
  public response: ApiErrorResponse;
  public status: number;
  data?: string | unknown;
  details?: unknown;
  constructor(message: string, response: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.response = response;
    this.status = response.status;
    this.message = message;
    this.data = response.data;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

// Type guard function
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
