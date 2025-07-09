import { HttpErrorResponse } from "@angular/common/http";
import { Observable, map, catchError, throwError } from "rxjs";
import { ApiError } from "../../core/models/api-error.model";
import { ApiResponse } from "../../core/models/api-response.model";

export function handleResponse<M, E>(
  response: Observable<ApiResponse<M>>,
  mapToEntity: (model: M) => E
): Observable<E> {
  return response.pipe(
    map((mResponse) => {
      // Check if API indicates failure even with 200 HTTP status
      if (!mResponse.success) {
        throw {
          message: mResponse.message || 'Failed to process response',
          errors: mResponse.errors || [],
          statusCode: mResponse.statusCode,
        } as ApiError;
      }
      return mapToEntity(mResponse.data);
    }),
    catchError((error: HttpErrorResponse | ApiError) => {
      if (error instanceof HttpErrorResponse) {
        // Handle 4xx client errors: expect ApiError in error.error from the backend
        if (error.status >= 400 && error.status < 500) {
          const responseBody = error.error;
          // Check if the response body is a well-formed ApiError
          if (responseBody &&
              typeof responseBody.message === 'string' &&
              Array.isArray(responseBody.errors) &&
              typeof responseBody.statusCode === 'number') {
            // If so, re-throw this ApiError from the backend
            return throwError(() => responseBody as ApiError);
          } else {
            // If error.error is not a valid ApiError (e.g., just a string or malformed),
            // construct a fallback ApiError.
            const fallbackClientError: ApiError = {
              message: (typeof responseBody === 'string' ? responseBody : error.message) || `Client Error: ${error.status}`,
              errors: (typeof responseBody === 'string' ? [responseBody] : (Array.isArray(responseBody?.errors) ? responseBody.errors : [error.message || 'An unspecified client error occurred.'])),
              statusCode: error.status,
            };
            return throwError(() => fallbackClientError);
          }
        } else {
          // For non-4xx HttpErrorResponse (e.g., 5xx, network errors, etc.)
          const serverError: ApiError = {
            message: 'Server error', // As requested
            errors: [error.message],    // As requested
            statusCode: error.status,
          };
          return throwError(() => serverError);
        }
      } else {
        // If it's not an HttpErrorResponse, it's already an ApiError instance
        // (e.g., thrown from the map operator if mResponse.success was false).
        // Pass it through directly.
        return throwError(() => error); // error is already an ApiError
      }
    })
  );
}
