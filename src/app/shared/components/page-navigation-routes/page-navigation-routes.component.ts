import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
export interface RouteLink{
  label: string;
  path: string;
}
@Component({
  selector: 'app-page-navigation-routes',
  imports: [CommonModule, TranslateModule, RouterModule, MatIconModule],
  templateUrl: './page-navigation-routes.component.html',
  styleUrl: './page-navigation-routes.component.scss'
})
export class PageNavigationRoutesComponent {
  routesList= input.required<RouteLink[]>();

  constructor() {
    // Initialize routesList if needed
  }
}
