import { ApiError } from "../../../../core/models/api-error.model";
import { AuthUser } from "../../domain/entities/auth-user.entity";

export const AUTH_TOKEN = 'auth_token';
export const CURRENT_AUTH_USER = 'current_auth_user';
export const TOKEN_EXPIRATION_KEY = 'tokenExpiration';
export const AUTH_STORE = 'auth';

export interface AuthState {
  userId: string |null;
  user: AuthUser | undefined;
  loading: boolean;
  error: ApiError | null;
}

export const initialAuthState: AuthState = {
  userId: null,
  user: undefined,
  loading: false,
  error: null,
};
