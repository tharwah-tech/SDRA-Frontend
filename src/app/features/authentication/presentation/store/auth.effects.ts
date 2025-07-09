import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Observable, switchMap, map, catchError, of, tap } from "rxjs";
import { TokenExpirationService } from "../../data/services/token-expiration.service";
import { Credentials } from "../../domain/entities/credentials.entity";
import { AuthActions } from "./auth.actions";
import { AUTH_TOKEN, CURRENT_AUTH_USER } from "./auth.store";
import { AuthRepository } from "../../domain/repositories/auth.repository";
import { RouteRedirectionService } from "../../../../core/services/route-redirection.service";
import { AUTH_REPOSITORY } from "../../data/providers/auth-repositories.provider";
import { showSnackbar } from "../../../../shared/utils/show-snackbar-notification.util";

@Injectable()
export class AuthEffects {
  login$: Observable<any>;
  loginSuccess$: Observable<any>;
  logout$: Observable<any>;
  logoutSuccess$: Observable<any>;
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

    // In auth.effects.ts, modify loginSuccess$
    this.loginSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.loginSuccess),
          tap((action) => {
            console.log("Login success with user role:", action.user.role);
            localStorage.setItem(AUTH_TOKEN, action.user.token);
            localStorage.setItem(CURRENT_AUTH_USER, JSON.stringify(action.user));
            if (action.user.tokenExpiration) {
              this.tokenExpirationService.setTokenExpiration(action.user.tokenExpiration);
            }
            this.tokenExpirationService.initExpirationMonitor(); // Initialize monitor on login

            // Consider adding a small delay before redirecting
            setTimeout(() => {
              const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'];
              this.routeRedirectionService.redirectBasedOnRole(action.user, returnUrl);
            }, 100);
          })
        ),
      { dispatch: false }
    );

    this.logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        switchMap(() =>
          this.authRepository.logout().pipe(
            map(() => AuthActions.logoutSuccess()),
            catchError((error) =>
              of(
                AuthActions.logoutSuccess()
                // AuthActions.logoutFailure({
                //   error: error.error?.message || 'Logout failed',
                // })
              )
            ) // Always logout even if API fails
          )
        )
      )
    );

    this.logoutSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.logoutSuccess),
          tap((action) => {
            localStorage.removeItem(AUTH_TOKEN);
            localStorage.removeItem(CURRENT_AUTH_USER);
            this.tokenExpirationService.clearTokenExpiration();
            this.tokenExpirationService.clearExpirationMonitor();

            // Get the language from the URL
            const urlSegments = this.router.url.split('/');
            const lang = ['en', 'ar'].includes(urlSegments[1])
              ? urlSegments[1]
              : 'en';

            this.router.navigate([`/${lang}/login`]);
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
                  error: error.error?.message || 'Get current user failed',
                })
              )
            )
          )
        )
      )
    );

    this.tokenExpired$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.tokenExpired),
          tap(() => {
            // Log the user out when token expires
            showSnackbar(this.toastr, {title: 'Session Expired!!', type:'info', description: 'Please login again'});
            this.store.dispatch(AuthActions.logout());
          })
        ),
      { dispatch: false }
    );
  }
}
