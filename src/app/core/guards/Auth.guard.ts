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
import { tap } from 'rxjs';
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
}
