export interface User {
    id:                string;
    email:             string;
    first_name:        string;
    last_name:         string;
    full_name:         string;
    organization:      string;
    organization_name: string;
    department:        null;
    status:            string;
    date_joined:       Date;
}


export interface AuthUser extends User {
  role: string; // Assuming role is a string, adjust as necessary
  token: string;
  tokenExpiration?: Date; // Optional, can be set by the API or derived from the JWT
}
