import { Observable } from "rxjs/internal/Observable";
import { AuthUser } from "../entities/auth-user.entity";
import { Credentials } from "../entities/credentials.entity";
import { RegistrationEntity } from "../entities/registration.entity";

export interface AuthRepository {
  login(credentials: Credentials): Observable<AuthUser>;
  register(credentials: RegistrationEntity): Observable<AuthUser>;
  logout(): Observable<void>;
  getCurrentUser(): Observable<AuthUser | undefined>;
}
