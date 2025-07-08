export interface Credentials {
  email: string;
  userName: string;
  password: string;
}
export function isCredentials(obj: any): obj is Credentials {
  return (
    typeof obj === 'object' &&
    typeof obj.email === 'string' &&
    typeof obj.userName === 'string' &&
    typeof obj.password === 'string'
  );
}
