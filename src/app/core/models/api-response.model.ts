export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  errors: ApiErrorRaw[];
}
export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return (typeof obj === 'object' &&
    typeof obj.success === 'boolean' &&
    typeof obj.message === 'string' &&
    Array.isArray(obj.errors) &&
    typeof obj.statusCode === 'number' && (obj.data !== undefined || false));
}

/**
 * Represents a single raw error object from the 'errors' array,
 * which can have dynamic keys (e.g., { "detail": "..." } or { "email": "..." }).
 * We use an index signature to allow any string key with a string value.
 */
export interface ApiErrorRaw {
  [key: string]: string;
}

/**
 * Represents a normalized error structure for easier consumption in the frontend.
 * We'll convert the raw errors into this consistent format.
 */
export interface NormalizedApiError {
  field?: string; // The specific field name (e.g., 'email', 'password')
  message: string; // The error message associated with the field or a general detail.
  // You could add 'code?: string;' if your backend ever provides a specific error code
  // within these dynamic objects, but based on your examples, 'field' and 'message' are enough.
}

/**
 * Represents a structured error response that will be thrown by the handleError method.
 */
export interface CustomHttpError {
  statusCode: number;
  message: string;
  normalizedErrors: NormalizedApiError[];
}
