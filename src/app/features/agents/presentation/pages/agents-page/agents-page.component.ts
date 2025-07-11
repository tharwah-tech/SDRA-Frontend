import { Component } from '@angular/core';
import { MainPageStructureComponent } from "../../../../../shared/components/main-page-structure/main-page-structure.component";
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';

@Component({
  selector: 'app-agents-page',
  imports: [MainPageStructureComponent],
  templateUrl: './agents-page.component.html',
  styleUrl: './agents-page.component.scss'
})
export class AgentsPageComponent {
SideNavTabs = SideNavTabs;
}
