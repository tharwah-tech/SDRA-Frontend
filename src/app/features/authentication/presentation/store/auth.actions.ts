import { createActionGroup, props, emptyProps } from "@ngrx/store";
import { ApiError } from "../../../../core/models/api-error.model";
import { AuthUser } from "../../domain/entities/auth-user.entity";
import { Credentials } from "../../domain/entities/credentials.entity";
import { AUTH_STORE } from "./auth.store";
import { RegistrationEntity } from "../../domain/entities/registration.entity";

export const AuthActions = createActionGroup({
  source: AUTH_STORE,
  events: {
    'Login': props<{ credentials: Credentials }>(),
    'Login Success': props<{ user: AuthUser }>(),
    'Login Failure': props<{ error: ApiError }>(),
    'Register': props<{ credentials: RegistrationEntity }>(),
    'Register Success': props<{ userId: string }>(),
    'Register Failure': props<{ error: ApiError }>(),
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: ApiError }>(),
    'Get Current User': emptyProps(),
    'Get Current User Success': props<{ user: AuthUser | undefined }>(),
    'Get Current User Failure': props<{ error: ApiError }>(),
    'Token Expired': emptyProps(),
  },
});
