import { User } from '../../domain/entities/auth-user.entity';

export interface LoginResponseModel {
  success: boolean;
  message: string;
  token: string;
  user: User;
}
