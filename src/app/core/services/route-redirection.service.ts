import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from '../../features/authentication/domain/entities/auth-user.entity';

@Injectable({
  providedIn: 'root'
})
export class RouteRedirectionService {

   constructor(private router: Router) {}

  /**
   * Redirects the user to the appropriate route based on their role
   */
  redirectBasedOnRole(
    user: AuthUser | undefined,
    returnUrl?: string | null
  ): void {
    console.log("Redirecting user with role:", user?.role);
    // Extract language from current URL or use default
    const urlSegments = this.router.url.split('/');
    const lang = ['en', 'ar'].includes(urlSegments[1]) ? urlSegments[1] : 'en';

    if (!user) {
      this.router.navigate([`/${lang}/login`]);
      return;
    }

    // Redirect based on role
    if (user.role === 'Auditor') {
      // Auditors can ONLY access assessment pages
      this.router.navigate([`/${lang}/assessments`]);
    } else {
      // For other roles, check if returnUrl is provided and valid
      if (returnUrl && this.isReturnUrlValidForRole(user.role, returnUrl)) {
        this.router.navigateByUrl(returnUrl);
      } else {
        // Default to dashboard for other roles
        this.router.navigate([`/${lang}`]);
      }
    }
  }

  /**
   * Check if the return URL is valid for the user's role
   */
  private isReturnUrlValidForRole(role: string, returnUrl: string): boolean {
    // Auditor role restrictions
    if (role === 'Auditor' && !returnUrl.includes('/assessment')) {
      return false;
    }

    // Add other role-specific URL validation if needed
    // For example, if certain roles can't access certain paths

    return true;
  }
}
