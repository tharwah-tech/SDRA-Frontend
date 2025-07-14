import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from "@angular/common/http";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, take, switchMap } from "rxjs";
import { AuthActions } from "../../features/authentication/presentation/store/auth.actions";
import { selectAccessToken } from "../../features/authentication/presentation/store/auth.selectors";
import { TOKEN_EXPIRATION_KEY } from "../../features/authentication/presentation/store/auth.store";

// Define the path segment for your logout API endpoint. Adjust if necessary.
const LOGOUT_API_PATH = '/auth/logout';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const store = inject(Store);

  // Only run the pre-emptive token expiration check if the current request is NOT for the logout endpoint.
  if (!request.url.includes(LOGOUT_API_PATH)) {
    const expirationString = localStorage.getItem(TOKEN_EXPIRATION_KEY);
    if (expirationString) {
      const expirationDate = new Date(expirationString);
      const bufferMilliseconds = 60 * 1000; // 1 minute buffer
      if (expirationDate.getTime() - bufferMilliseconds <= new Date().getTime()) {
        console.log(`Token expired for non-logout request (${request.url}). Dispatching tokenExpired action.`);
        store.dispatch(AuthActions.tokenExpired());
        // The original request still proceeds. The tokenExpired action should lead to logout
        // and navigation, making the outcome of this original request generally less critical.
        // The main goal here is to prevent re-triggering logout on the logout call itself.
      }
    }
  }

  // This part attaches the token to outgoing requests.
  // It should run for ALL requests, including logout, if a token is available,
  // as the server might require the token to validate the logout action.
  return store.select(selectAccessToken).pipe(
    take(1),
    switchMap((token) => {
      if (token) {
        const authReq = request.clone({
          setHeaders: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return next(authReq);
      } else {
        return next(request); // No token, proceed without auth header
      }
    })
  );
};
