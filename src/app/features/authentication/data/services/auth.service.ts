import { Inject, Injectable } from '@angular/core';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { map, Observable, of, tap, throwError, catchError, timeout } from 'rxjs';
import { AuthUser } from '../../domain/entities/auth-user.entity';
import { Credentials } from '../../domain/entities/credentials.entity';
import { RegistrationEntity } from '../../domain/entities/registration.entity';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BASE_API_URL } from '../../../../app.config';
import { TokenExpirationService } from './token-expiration.service';
import { LoginResponseModel } from '../models/login-response.model';
import { handleResponse } from '../../../../shared/utils/handle-reponses.util';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { RegisterResponseModel } from '../models/register-response.model';
import { LogoutReponseModel } from '../models/logut-response.model';
import { AUTH_TOKEN, CURRENT_AUTH_USER } from '../../presentation/store/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements AuthRepository {
  private apiUrl: string;
  private readonly LOGOUT_TIMEOUT = 10000; // 10 seconds timeout

  constructor(
    @Inject(BASE_API_URL) private baseUrl: string,
    private http: HttpClient,
    private tokenExpirationService: TokenExpirationService
  ) {
    this.apiUrl = `${this.baseUrl}/auth`;
  }

  login(credentials: Credentials): Observable<AuthUser> {
    const url = `${this.apiUrl}/login/`;
    const response: Observable<
      ApiResponse<{
        loginResponse: LoginResponseModel;
        expirationDate: Date | null;
      }>
    > = this.http.post<ApiResponse<LoginResponseModel>>(url, credentials).pipe(
      map((apiResponse) => {
        // If tokenExpiration is not provided by API, try to extract it from JWT
        let authUser!: AuthUser;
        if (apiResponse.data.user && apiResponse.data.token) {
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
          ...apiResponse,
          data: {
            loginResponse: apiResponse.data,
            expirationDate: this.getTokenExpirationDate(apiResponse.data.token),
          },
        } as ApiResponse<{
          loginResponse: LoginResponseModel;
          expirationDate: Date | null;
        }>;
      })
    );
    return handleResponse<
      { loginResponse: LoginResponseModel; expirationDate: Date | null },
      AuthUser
    >(response, (model) => {
      // Map the LoginResponseModel to AuthUser
      return {
        ...model.loginResponse.user,
        token: model.loginResponse.token,
        role: 'admin',
        tokenExpiration: model.expirationDate ?? undefined,
      };
    });
  }

  register(credentials: RegistrationEntity): Observable<string> {
    const url = `${this.apiUrl}/register/`;
    const response = this.http.post<ApiResponse<RegisterResponseModel>>(url, {
      email: credentials.email,
      first_name: credentials.firstName,
      last_name: credentials.lastName,
      organization: credentials.organization,
      password: credentials.password,
      confirm_password: credentials.confirmPassword,
    });
    return handleResponse<RegisterResponseModel, string>(
      response,
      (model) => model.user_id
    );
  }

  /**
   * ✨ ENHANCED LOGOUT METHOD
   * Matches your API specification: POST 'https://api.sdra-dev.com/auth/logout/'
   * With Authorization: Token header
   * 
   * Expected response structure:
   * {
   *   "success": true,
   *   "message": "Request successful",
   *   "data": {
   *     "success": true,
   *     "message": "Successfully logged out"
   *   },
   *   "statusCode": 200,
   *   "errors": []
   * }
   */
  logout(): Observable<boolean> {
    const url = `${this.apiUrl}/logout/`;
    
    console.log('🔄 Sending logout request to:', url);
    
    // Make the logout request with proper timeout and error handling
    const response = this.http.post<ApiResponse<LogoutReponseModel>>(url, {}, {
      // Headers are automatically added by auth interceptor
      // Authorization: Token will be added automatically
    }).pipe(
      // Set timeout to prevent hanging requests
      timeout(this.LOGOUT_TIMEOUT),
      
      // Log successful response with full structure
      tap((response) => {
        console.log('✅ Full logout API response:', {
          success: response.success,
          message: response.message,
          statusCode: response.statusCode,
          data: response.data,
          hasErrors: response.errors.length > 0
        });
      }),
      
      // Enhanced error handling
      catchError((error: HttpErrorResponse) => {
        console.warn('⚠️ Logout API error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        
        // Log specific error scenarios
        if (error.status === 0) {
          console.warn('Network error or CORS issue during logout');
        } else if (error.status === 401) {
          console.warn('Token already invalid - proceeding with logout');
        } else if (error.status === 404) {
          console.warn('Logout endpoint not found');
        } else if (error.status >= 500) {
          console.warn('Server error during logout');
        } else {
          console.warn(`Logout failed with status ${error.status}: ${error.message}`);
        }
        
        // For logout, we should always succeed locally even if API fails
        // This is a security best practice - never prevent user from logging out
        // Return response in your exact API format
        return of({
          success: true,
          message: 'Request successful (local fallback)',
          data: { 
            success: true,
            message: 'Successfully logged out locally due to API error'
          },
          statusCode: 200,
          errors: []
        } as ApiResponse<LogoutReponseModel>);
      })
    );

    // Process the response using your handleResponse utility
    // The handleResponse will extract the 'data' field from ApiResponse
    return handleResponse<LogoutReponseModel, boolean>(
      response,
      (logoutData) => {
        // logoutData is now: { success: true, message: "Successfully logged out" }
        console.log('✅ Logout data processed:', {
          success: logoutData.success,
          message: logoutData.message
        });
        
        // Return the success status from the logout data
        return logoutData.success;
      }
    );
  }

  getCurrentUser(): Observable<AuthUser | undefined> {
    try {
      const storedUser = localStorage.getItem(CURRENT_AUTH_USER);
      if (!storedUser) {
        console.log('No stored user found');
        return of(undefined);
      }

      const user: AuthUser = JSON.parse(storedUser);

      // Validate user data
      if (!user.id || !user.email) {
        console.warn('Invalid user data found in storage');
        return of(undefined);
      }

      // Convert date strings back to Date objects if they exist
      if (user.date_joined && typeof user.date_joined === 'string') {
        user.date_joined = new Date(user.date_joined);
      }
      if (user.tokenExpiration && typeof user.tokenExpiration === 'string') {
        user.tokenExpiration = new Date(user.tokenExpiration);
      }

      // Check if token is expired
      if (user.tokenExpiration && user.tokenExpiration < new Date()) {
        console.warn('Stored user token is expired');
        return of(undefined);
      }

      console.log('✅ Retrieved current user from storage');
      return of(user);
    } catch (error) {
      console.error('❌ Error parsing stored user data:', error);
      
      // Clean up corrupted data
      localStorage.removeItem(CURRENT_AUTH_USER);
      return of(undefined);
    }
  }

  /**
   * Extract JWT token expiration date
   */
  getTokenExpirationDate(token: string): Date | null {
    try {
      if (!token) return null;
      
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        // Not a JWT token, might be a simple token
        console.log('Token is not in JWT format');
        return null;
      }

      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      if (!tokenPayload.exp) {
        console.log('Token does not contain expiration time');
        return null;
      }

      // Convert the Unix timestamp to milliseconds and create Date
      const expirationDate = new Date(tokenPayload.exp * 1000);
      console.log('📅 Token expires at:', expirationDate);
      return expirationDate;
    } catch (error) {
      console.error('❌ Error extracting token expiration:', error);
      return null;
    }
  }

  /**
   * Check if current stored token is valid
   */
  isTokenValid(): boolean {
    try {
      const storedUser = localStorage.getItem(CURRENT_AUTH_USER);
      if (!storedUser) return false;

      const user: AuthUser = JSON.parse(storedUser);
      if (!user.token) return false;

      // Check expiration if available
      if (user.tokenExpiration) {
        const expirationDate = typeof user.tokenExpiration === 'string' 
          ? new Date(user.tokenExpiration) 
          : user.tokenExpiration;
        
        if (expirationDate < new Date()) {
          console.log('Token has expired');
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  }
}