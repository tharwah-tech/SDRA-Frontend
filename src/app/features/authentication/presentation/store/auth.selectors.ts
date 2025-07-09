import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.store";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsLoggedIn = createSelector(selectCurrentUser, (user) => !!user);

export const selectAccessToken = createSelector(selectCurrentUser, (user) => user?.token);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);
