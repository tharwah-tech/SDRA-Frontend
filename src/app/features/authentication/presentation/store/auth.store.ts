import { ApiError } from "../../../../core/models/api-error.model";
import { AuthUser } from "../../domain/entities/auth-user.entity";

export const AUTH_TOKEN = 'auth_token';
export const CURRENT_AUTH_USER = 'current_auth_user';
export const TOKEN_EXPIRATION_KEY = 'tokenExpiration';
export const AUTH_STORE = 'auth_store';

export interface AuthState {
  user: AuthUser | undefined;
  loading: boolean;
  error: ApiError | null;
}

export const initialAuthState: AuthState = {
  user: undefined,
  loading: false,
  error: null,
};
