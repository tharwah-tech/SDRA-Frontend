import { Component, input } from '@angular/core';
export interface routeLink{
  name: string;
  path: string;
}
@Component({
  selector: 'app-page-navigation-routes',
  imports: [],
  templateUrl: './page-navigation-routes.component.html',
  styleUrl: './page-navigation-routes.component.scss'
})
export class PageNavigationRoutesComponent {
  routesList= input.required<routeLink[]>();

  constructor() {
    // Initialize routesList if needed
  }
}
