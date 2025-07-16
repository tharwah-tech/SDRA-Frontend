import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  MaybeAsync,
  GuardResult,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { tap, map } from 'rxjs';
import { selectIsLoggedIn } from '../../features/authentication/presentation/store/auth.selectors';
import { AuthState } from '../../features/authentication/presentation/store/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AuthState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    // Check if the current route should bypass authentication
    const shouldBypassAuth = this.shouldBypassAuthentication(route,state.url);

    if (shouldBypassAuth) {
      return true; // Allow access without authentication
    }

    return this.store.select(selectIsLoggedIn).pipe(
      tap((loggedIn) => {
        if (!loggedIn) {
          const lang = route.paramMap.get('lang') ?? 'en';
          this.router.navigate([lang, 'auth', 'login'], {
            queryParams: { returnUrl: state.url },
          });
        }
      })
    );
  }

  private shouldBypassAuthentication(route: ActivatedRouteSnapshot,url: string): boolean {
    const lang = route.paramMap.get('lang') ?? 'en';
    // Define routes that should bypass authentication
    const publicRoutes = [
      `${lang}/agents/agents_lab/interviewer/interviews/start`,
      `${lang}/agents/agents_lab/interviewer/interviews/completed`
    ];

    return publicRoutes.some(route => url.includes(route));
  }
}
