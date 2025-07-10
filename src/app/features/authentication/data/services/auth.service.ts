import { Inject, Injectable } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { map, Observable, of, tap, throwError } from 'rxjs';
import { AuthUser } from '../../domain/entities/auth-user.entity';
import { Credentials } from '../../domain/entities/credentials.entity';
import { RegistrationEntity } from '../../domain/entities/registration.entity';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL } from '../../../../app.config';
import { TokenExpirationService } from './token-expiration.service';
import { LoginResponseModel } from '../models/login-response.model';
import { handleResponse } from '../../../../shared/utils/handle-reponses.util';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthRepository {
  private apiUrl: string;

  constructor(
    @Inject(BASE_API_URL) private baseUrl: string,
    private http: HttpClient,
    private tokenExpirationService: TokenExpirationService
  ) {
    this.apiUrl = `${this.baseUrl}/auth`;
  }

  login(credentials: Credentials): Observable<AuthUser> {
    const url = `${this.apiUrl}/login/`;
    const response: Observable<ApiResponse<{loginResponse: LoginResponseModel, expirationDate: Date | null}>> = this.http
      .post<ApiResponse<LoginResponseModel>>(url, credentials)
      .pipe(
        map((apiResponse) => {
          // If tokenExpiration is not provided by API, try to extract it from JWT
          let authUser!: AuthUser;
          if (
            apiResponse.data.user &&
            apiResponse.data.token
          ) {
            const expirationDate = this.getTokenExpirationDate(
              apiResponse.data.token
            );
            if (expirationDate) {
              authUser = {
                ...apiResponse.data.user,
                token: apiResponse.data.token,
                role: 'admin',
                tokenExpiration: new Date(expirationDate),
              };
              this.tokenExpirationService.setTokenExpiration(expirationDate);
            }
          }
          return {
            ... apiResponse,
            data: {loginResponse: apiResponse.data, expirationDate: this.getTokenExpirationDate(apiResponse.data.token) }
          } as ApiResponse<{loginResponse: LoginResponseModel, expirationDate: Date | null}>;
        })
      );
      return handleResponse<{loginResponse: LoginResponseModel, expirationDate: Date | null}, AuthUser>(response, (model) => {
        // Map the LoginResponseModel to AuthUser
        return {
          ...model.loginResponse.user,
          token: model.loginResponse.token,
          role: 'admin',
          tokenExpiration: model.expirationDate ?? undefined
        };
      });
  }

  register(credentials: RegistrationEntity): Observable<AuthUser> {
   return throwError(() => new Error('Method not implemented.'));
  }

  logout(): Observable<void> {
     return this.http.post<void>(`${this.apiUrl}/logout/`, {}).pipe(
      tap(() => {
        this.tokenExpirationService.clearTokenExpiration();
        // localStorage.removeItem(this.tokenKey);
        // this.currentUserSubject.next(undefined);
      })
    );
  }

  getCurrentUser(): Observable<AuthUser | undefined> {
    return throwError(() => new Error('Method not implemented.'));
  }

  // Add this to your AuthService
  getTokenExpirationDate(token: string): Date | null {
    // Extract expiration from a token if it's a JWT
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return null;

      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      if (!tokenPayload.exp) return null;

      // Convert the Unix timestamp to milliseconds and create Date
      return new Date(tokenPayload.exp * 1000);
    } catch (e) {
      return null;
    }
  }
}

