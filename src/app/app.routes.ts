import { Routes } from '@angular/router';
import { LangGuard } from './core/guards/Lang.guard';
import { NotAuthorizedPageComponent } from './shared/pages/not-authorized-page/not-authorized-page.component';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';
import { AUTH_ROUTES } from './features/authentication/auth.routes';
import { LANDING_ROUTES } from './features/LandingPage/landing.routes';
import { AGENTS_ROUTES } from './features/agents/agents.routes';
import { AuthGuard } from './core/guards/Auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/en',
    pathMatch: 'full',
  },
  {
    path: ':lang',
    redirectTo: ':lang/home',
    pathMatch: 'full',
  },
  {
    path: ':lang/home',
    children: LANDING_ROUTES,
    canActivate: [LangGuard],
  },
  {
    path: ':lang/agents',
    children: AGENTS_ROUTES,
    canActivate: [LangGuard, AuthGuard],
  },
  {
    path: ':lang/auth',
    children: AUTH_ROUTES,
    canActivate: [LangGuard],
  },
  {
    path: ':lang/not-found',
    component: NotFoundPageComponent,
    canActivate: [LangGuard],
    title: 'Not Found',
  },
  {
    path: ':lang/not-authorized',
    component: NotAuthorizedPageComponent,
    canActivate: [LangGuard],
    title: 'Not authorized',
  },
  {
    path: '**',
    redirectTo: 'en/not-found',
    pathMatch: 'full',
  },
];
