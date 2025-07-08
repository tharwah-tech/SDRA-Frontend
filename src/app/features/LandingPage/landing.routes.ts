import {LandingPageComponent} from './presentation/pages/landing-page/landing-page.component';
import {Routes} from '@angular/router';

export const LANDING_ROUTES: Routes = [
  { path: '', component: LandingPageComponent, title: 'Home' },
];
