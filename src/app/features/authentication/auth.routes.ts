import { Routes } from '@angular/router';
import { LoginPageComponent } from './presentation/pages/login-page/login-page.component';
import { RegisterPageComponent } from './presentation/pages/register-page/register-page.component';
import { AUTH_REPOSITORY } from './data/providers/auth-repositories.provider';
import { AuthService } from './data/services/auth.service';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    providers: [
      {
        provide: AUTH_REPOSITORY,
        useClass: AuthService,
      },
    ],
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Login'
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    title: 'Register'
  },
];
