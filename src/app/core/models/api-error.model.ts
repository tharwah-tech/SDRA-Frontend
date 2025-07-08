export interface ApiError {
  message: string;
  errors: string[];
  statusCode: number;
}
export function isApiError(obj: any): obj is ApiError {
  return (
    typeof obj === 'object' &&
    typeof obj.message === 'string' &&
    Array.isArray(obj.errors) &&
    obj.errors.every((error: any) => typeof error === 'string') &&
    typeof obj.statusCode === 'number'
  );
}
