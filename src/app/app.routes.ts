// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LangGuard } from './core/guards/Lang.guard';
import { NotAuthorizedPageComponent } from './shared/pages/not-authorized-page/not-authorized-page.component';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/en',
    pathMatch: 'full',
  },
  {
    path: ':lang',
    canActivate: [LangGuard],
    children: [
      {
        path: '',
        redirectTo: 'agents',
        pathMatch: 'full'
      },
      {
        path: 'agents',
        loadChildren: () => import('./features/agents/agents.routes').then(m => m.agentsRoutes)
      },
      {
        path: 'not-found',
        component: NotFoundPageComponent,
        title: 'Not Found',
      },
      {
        path: 'not-authorized',
        component: NotAuthorizedPageComponent,
        title: 'Not authorized',
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'en/not-found',
    pathMatch: 'full',
  },
];