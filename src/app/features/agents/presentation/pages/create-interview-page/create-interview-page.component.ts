import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MainPageStructureComponent } from '../../../../../shared/components/main-page-structure/main-page-structure.component';
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';
import { CreateInterviewFormComponent } from "../../components/create-interview-form/create-interview-form.component";

@Component({
  selector: 'app-create-interview-page',
  imports: [CommonModule, TranslateModule, MainPageStructureComponent, CreateInterviewFormComponent],
  templateUrl: './create-interview-page.component.html',
  styleUrl: './create-interview-page.component.scss',
})
export class CreateInterviewPageComponent {
  SideNavTabs = SideNavTabs;
  lang = input.required<string>();
  id = input.required<string>();
  constructor() {}
  OnInit(): void {
    // Initialization logic if needed
  }

CurrentPagePath(): RouteLink[] {
    return [
      { path: `/${this.lang()}/agents`, label: 'AI Agents' },
      { path: `/${this.lang()}/agents/agent/${this.id()}`, label: 'View Agent' },
      { path: `/${this.lang()}/agents/agent/${this.id()}/create-interview`, label: 'Create Interview' }
    ];
  }
}
