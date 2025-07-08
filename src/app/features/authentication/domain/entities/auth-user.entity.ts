export interface AuthUser {
  token: string;
  refreshToken: string;
  tokenExpiration: Date;
  userId: number;
  username: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  organizationId: number | null;
  organizationName: string | null;
}
export function isAuthUser(obj: any): obj is AuthUser {
  return (
    typeof obj === 'object' &&
    typeof obj.token === 'string' &&
    typeof obj.refreshToken === 'string' &&
    obj.tokenExpiration instanceof Date &&
    typeof obj.userId === 'number' &&
    typeof obj.username === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.role === 'string' &&
    Array.isArray(obj.permissions) &&
    (typeof obj.organizationId === 'number' || obj.organizationId === null) &&
    (typeof obj.organizationName === 'string' || obj.organizationName === null)
  );
}
