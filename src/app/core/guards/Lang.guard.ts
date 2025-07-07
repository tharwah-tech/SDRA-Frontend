import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LangGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const lang = route.paramMap.get('lang');
    if (lang === 'en' || lang === 'ar') {
      return true;
    } else {
      this.router.navigate(['/en/not-found']);
      return false;
    }
  }
}
