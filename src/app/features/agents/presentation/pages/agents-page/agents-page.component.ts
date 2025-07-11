import { Component, input } from '@angular/core';
import { MainPageStructureComponent } from "../../../../../shared/components/main-page-structure/main-page-structure.component";
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
import { Route } from '@angular/router';
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-agents-page',
  imports: [CommonModule, TranslateModule, MainPageStructureComponent],
  templateUrl: './agents-page.component.html',
  styleUrl: './agents-page.component.scss'
})
export class AgentsPageComponent {
SideNavTabs = SideNavTabs;
lang = input.required<string>();

CurrentPagePath(): RouteLink[]{
  return [
    { path: `/${this.lang()}/agents`, label: 'AI Agents' }
  ];
}
}
