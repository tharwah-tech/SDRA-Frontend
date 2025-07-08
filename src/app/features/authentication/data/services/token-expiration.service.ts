import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AUTH_TOKEN, TOKEN_EXPIRATION_KEY } from '../../presentation/store/auth.store';
import { AuthActions } from '../../presentation/store/auth.actions';

const EXPIRATION_CHECK_INTERVAL = 30 * 1000; // Check every 30 seconds

@Injectable({
  providedIn: 'root'
})
export class TokenExpirationService {

  private intervalId: any;

  constructor(private store: Store) {}

  initExpirationMonitor(): void {
    // Clear any existing interval
    this.clearExpirationMonitor();

    // Start a new interval
    this.intervalId = setInterval(() => {
      this.checkTokenExpiration();
    }, EXPIRATION_CHECK_INTERVAL);
    // Initial check
    this.checkTokenExpiration();
  }

  clearExpirationMonitor(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private checkTokenExpiration(): void {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (!token) {
      this.clearExpirationMonitor(); // No token, no need to monitor
      return;
    }

    const expirationString = localStorage.getItem(TOKEN_EXPIRATION_KEY);
    if (!expirationString) {
      // If expiration is not stored, we might need to re-fetch user or logout
      // For now, let's assume if there's a token but no expiration, it's an issue.
      // Or, decode token here if not available. For simplicity, we assume it's stored by AuthService.
      console.warn('Token expiration time not found in localStorage.');
      // Optionally dispatch logout or try to get current user again.
      // this.store.dispatch(AuthActions.logout());
      return;
    }

    const expirationDate = new Date(expirationString);
    // Check if the token is expired
    // Add a small buffer (e.g., 1 minute) to be safe, to account for minor clock differences or request latency
    const bufferMilliseconds = 60 * 1000; // 1 minute

    // The following comparison checks if the token has expired or is about to expire.
    //
    // Addressing potential timezone concerns:
    // 1. `expirationDate`: This `Date` object is created by parsing a string retrieved
    //    from `localStorage`. This string was stored by `setTokenExpiration`
    //    using `new Date(inputDate).toISOString()`. `toISOString()` always produces
    //    a string representation of the date in UTC (e.g., "2023-10-27T14:30:00.000Z").
    //    When `new Date("YYYY-MM-DDTHH:mm:ss.sssZ")` is called (as it happens when
    //    `expirationString` is read from localStorage and parsed), it correctly
    //    interprets the string as a UTC time.
    //    Therefore, `expirationDate.getTime()` returns the number of milliseconds
    //    since the UTC epoch (January 1, 1970, 00:00:00 UTC). This is an absolute,
    //    timezone-agnostic timestamp.
    //
    // 2. `new Date().getTime()`: This also returns the current number of milliseconds
    //    since the UTC epoch, based on the client's system clock. While the client's
    //    clock *displays* local time, `.getTime()` provides the underlying UTC timestamp.
    //
    // 3. Comparison: The comparison `expirationDate.getTime() - bufferMilliseconds <= new Date().getTime()`
    //    is therefore between two UTC-based millisecond timestamps. Differences in local
    //    timezone settings (e.g., server in PST, client in EST) do not affect the
    //    correctness of this comparison because both values are normalized to UTC.
    //
    // 4. Server Time vs. Client Time: The "server time" (original token expiry) is effectively
    //    captured as a UTC timestamp when stored. The "current user time" is also converted
    //    to a UTC timestamp for comparison.
    //
    // 5. Clock Skew: A separate concern is clock skew – if the client's system clock is
    //    inaccurate. The `bufferMilliseconds` provides a small margin to account for minor
    //    discrepancies or network latency, but significant clock skew can still lead to
    //    premature or delayed expiration detection. This is a general challenge with
    //    client-side expiration checks.
    //
    if (expirationDate.getTime() - bufferMilliseconds <= new Date().getTime()) {
      console.log('Token has expired or is about to expire based on client-side check. Dispatching tokenExpired action.');
      this.store.dispatch(AuthActions.tokenExpired());
      this.clearExpirationMonitor(); // Stop monitoring after expiration
    }
  }

  // Call this method when the user logs in and token/expiration is received
  setTokenExpiration(expirationDate: Date | string): void {
    localStorage.setItem(TOKEN_EXPIRATION_KEY, new Date(expirationDate).toISOString());
  }

  // Call this method on logout
  clearTokenExpiration(): void {
    localStorage.removeItem(TOKEN_EXPIRATION_KEY);
  }
}
