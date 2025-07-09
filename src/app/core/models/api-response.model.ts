export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  errors: string[];
}
export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return (
    typeof obj === 'object' &&
    typeof obj.success === 'boolean' &&
    typeof obj.message === 'string' &&
    Array.isArray(obj.errors) &&
    typeof obj.statusCode === 'number' &&
    (obj.data !== undefined || obj.data === null) // data can be any type, including null
  );
}
