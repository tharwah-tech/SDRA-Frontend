import {Routes} from '@angular/router';
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
