import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, switchMap, map, catchError, of, tap, delay, finalize } from 'rxjs';
import { TokenExpirationService } from '../../data/services/token-expiration.service';
import { Credentials } from '../../domain/entities/credentials.entity';
import { AuthActions } from './auth.actions';
import { AUTH_TOKEN, CURRENT_AUTH_USER, TOKEN_EXPIRATION_KEY } from './auth.store';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { RouteRedirectionService } from '../../../../core/services/route-redirection.service';
import { AUTH_REPOSITORY } from '../../data/providers/auth-repositories.provider';
import { showSnackbar } from '../../../../shared/utils/show-snackbar-notification.util';
import { RegistrationEntity } from '../../domain/entities/registration.entity';

@Injectable()
export class AuthEffects {
  login$: Observable<any>;
  loginSuccess$: Observable<any>;
  register$: Observable<any>;
  registerSuccess$: Observable<any>;
  logout$: Observable<any>;
  logoutSuccess$: Observable<any>;
  logoutFailure$: Observable<any>;
  getCurrentUser$: Observable<any>;
  tokenExpired$: Observable<any>;

  constructor(
    @Inject(AUTH_REPOSITORY) private authRepository: AuthRepository,
    private actions$: Actions,
    private routeRedirectionService: RouteRedirectionService,
    private store: Store,
    private toastr: ToastrService,
    private router: Router,
    private tokenExpirationService: TokenExpirationService
  ) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(({ credentials }: { credentials: Credentials }) =>
          this.authRepository.login(credentials).pipe(
            map((response) => AuthActions.loginSuccess({ user: response })),
            catchError((error) => {
              return of(
                AuthActions.loginFailure({
                  error: {
                    message: error.error?.message || 'Login failed',
                    errors: error.error?.errors,
                    statusCode: error.error?.statusCode,
                  },
                })
              );
            })
          )
        )
      )
    );

    this.loginSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.loginSuccess),
          tap((action) => {
            console.log('Login success with user role:', action.user.role);
            localStorage.setItem(AUTH_TOKEN, action.user.token);
            localStorage.setItem(
              CURRENT_AUTH_USER,
              JSON.stringify(action.user)
            );
            if (action.user.tokenExpiration) {
              this.tokenExpirationService.setTokenExpiration(
                action.user.tokenExpiration
              );
            }
            this.tokenExpirationService.initExpirationMonitor();

            // Consider adding a small delay before redirecting
            setTimeout(() => {
              const returnUrl =
                this.router.routerState.snapshot.root.queryParams['returnUrl'];
              this.routeRedirectionService.redirectBasedOnRole(
                action.user,
                returnUrl
              );
            }, 100);
          })
        ),
      { dispatch: false }
    );

    this.register$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.register),
        switchMap(({ credentials }: { credentials: RegistrationEntity }) =>
          this.authRepository.register(credentials).pipe(
            map((response) =>
              AuthActions.registerSuccess({ userId: response })
            ),
            catchError((error) => {
              return of(
                AuthActions.registerFailure({
                  error: {
                    message: error.error?.message || 'Register failed',
                    errors: error.error?.errors,
                    statusCode: error.error?.statusCode,
                  },
                })
              );
            })
          )
        )
      )
    );

    this.registerSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.registerSuccess),
          tap((response) => {
            this.router.navigate(['en', 'auth', 'login']);
            showSnackbar(this.toastr, {
              title: `User Registered successfully with id: ${response.userId}`,
              type: 'success',
            });
          })
        ),
      { dispatch: false }
    );

    // ✨ ENHANCED LOGOUT EFFECT
    this.logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          // Show logout initiated message
          console.log('🔄 Logout initiated...');
        }),
        switchMap(() =>
          this.authRepository.logout().pipe(
            // Add small delay to show loading state
            delay(300),
            map((success) => {
              console.log('✅ Logout API call result:', success);
              return AuthActions.logoutSuccess();
            }),
            catchError((error) => {
              console.warn('⚠️ Logout API call failed, proceeding with local logout:', error);
              // Even if API fails, we still logout locally for security
              // This ensures users can always logout even if server is unreachable
              return of(AuthActions.logoutSuccess());
              
              // Uncomment below if you want to handle API failures differently
              // return of(AuthActions.logoutFailure({
              //   error: {
              //     message: error.error?.message || 'Logout request failed',
              //     errors: error.error?.errors || ['Unable to reach server'],
              //     statusCode: error.status || 500,
              //   }
              // }));
            })
          )
        )
      )
    );

    // ✨ ENHANCED LOGOUT SUCCESS EFFECT
    this.logoutSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.logoutSuccess),
          tap(() => {
            console.log('🧹 Cleaning up user session...');
            
            // Clear all authentication-related data
            this.clearUserSession();
            
            // Show success message
            showSnackbar(this.toastr, {
              title: 'Signed Out Successfully',
              description: 'You have been safely signed out of your account.',
              type: 'success',
            });

            // Navigate to login page with current language
            this.navigateToLogin();
            
            console.log('✅ Logout completed successfully');
          })
        ),
      { dispatch: false }
    );

    // ✨ NEW LOGOUT FAILURE EFFECT (if you want to handle API failures)
    this.logoutFailure$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.logoutFailure),
          tap((action) => {
            console.warn('❌ Logout failed:', action.error);
            
            // Still clear local session for security
            this.clearUserSession();
            
            // Show error message but still redirect
        showSnackbar(this.toastr, {
          type: 'error',
          error: action.error
        });

            // Navigate to login regardless of API failure
            this.navigateToLogin();
          })
        ),
      { dispatch: false }
    );

    this.getCurrentUser$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.getCurrentUser),
        switchMap(() =>
          this.authRepository.getCurrentUser().pipe(
            map((user) => AuthActions.getCurrentUserSuccess({ user })),
            catchError((error) =>
              of(
                AuthActions.getCurrentUserFailure({
                  error: {
                    message: error.error?.message || 'Get current user failed',
                    errors: error.error?.errors || ['Unable to retrieve user data'],
                    statusCode: error.status || 500,
                  }
                })
              )
            )
          )
        )
      )
    );

    // ✨ ENHANCED TOKEN EXPIRED EFFECT
    this.tokenExpired$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.tokenExpired),
          tap(() => {
            console.log('⏰ Token expired, initiating logout...');
            
            // Show token expiration message
            showSnackbar(this.toastr, {
              title: 'Session Expired',
              description: 'Your session has expired. Please sign in again to continue.',
              type: 'info',
            });

            // Dispatch logout action to clean up properly
            this.store.dispatch(AuthActions.logout());
          })
        ),
      { dispatch: false }
    );
  }

  /**
   * Clear all user session data from local storage and services
   */
  private clearUserSession(): void {
    try {
      // Clear localStorage items
      localStorage.removeItem(AUTH_TOKEN);
      localStorage.removeItem(CURRENT_AUTH_USER);
      localStorage.removeItem(TOKEN_EXPIRATION_KEY);
      
      // Clear any other auth-related localStorage items
      const authKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('auth_') || 
        key.startsWith('token_') || 
        key.startsWith('user_')
      );
      authKeys.forEach(key => localStorage.removeItem(key));

      // Clear token expiration service
      this.tokenExpirationService.clearTokenExpiration();
      this.tokenExpirationService.clearExpirationMonitor();

      // Clear any cached user data in services if needed
      // Add any other cleanup logic your app needs

      console.log('🧹 Session data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing session data:', error);
    }
  }

  /**
   * Navigate to login page with proper language support
   */
  private navigateToLogin(): void {
    try {
      // Get current language from URL or default to 'en'
      const urlSegments = this.router.url.split('/');
      const lang = ['en', 'ar'].includes(urlSegments[1]) ? urlSegments[1] : 'en';
      
      // Navigate to login page - corrected path
      this.router.navigate([`/${lang}/auth/login`]).then(() => {
        console.log(`🔄 Navigated to login page: /${lang}/auth/login`);
      }).catch((error) => {
        console.error('❌ Navigation error:', error);
        // Fallback navigation
        this.router.navigate(['/en/auth/login']);
      });
    } catch (error) {
      console.error('❌ Error during navigation:', error);
      // Ultimate fallback
      window.location.href = '/en/auth/login';
    }
  }
}