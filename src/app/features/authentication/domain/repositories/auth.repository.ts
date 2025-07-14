import { Observable } from "rxjs/internal/Observable";
import { AuthUser } from "../entities/auth-user.entity";
import { Credentials } from "../entities/credentials.entity";
import { RegistrationEntity } from "../entities/registration.entity";

export interface AuthRepository {
  login(credentials: Credentials): Observable<AuthUser>;
  register(credentials: RegistrationEntity): Observable<string>;
  logout(): Observable<boolean>;
  getCurrentUser(): Observable<AuthUser | undefined>;
}
