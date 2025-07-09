export interface Credentials {
  email: string;
  userName: string | null;
  password: string;
}
export function isCredentials(obj: any): obj is Credentials {
  return (
    typeof obj === 'object' &&
    typeof obj.email === 'string' &&
    (typeof obj.userName === 'string' || obj.userName === null) &&
    typeof obj.password === 'string'
  );
}
export function isCredentialsValid(credentials: Credentials): boolean {
  return (
    typeof credentials.email === 'string' &&
    (typeof credentials.userName === 'string' || credentials.userName === null) &&
    typeof credentials.password === 'string' &&
    credentials.email.trim() !== '' &&
    credentials.password.trim() !== ''
  );
}
