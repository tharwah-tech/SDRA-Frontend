import { Component, input } from '@angular/core';
import { MainPageStructureComponent } from "../../../../../shared/components/main-page-structure/main-page-structure.component";
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
import { Route } from '@angular/router';
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AgentSummary } from '../../../domain/entities/agent.entity';
import { AgentSummaryCardComponent } from "../../components/agent-summary-card/agent-summary-card.component";
import { AgentType } from '../../../../../core/enums/agents-type.enum';

@Component({
  selector: 'app-agents-page',
  imports: [CommonModule, TranslateModule, MainPageStructureComponent, AgentSummaryCardComponent],
  templateUrl: './agents-page.component.html',
  styleUrl: './agents-page.component.scss'
})
export class AgentsPageComponent {
SideNavTabs = SideNavTabs;
lang = input.required<string>();
agentsList! : AgentSummary[];
constructor() {
  // Initialize agentsList with some dummy data or fetch from a service
  this.agentsList = [
    {
      id: '1',
      name: 'Salah',
      description: 'Expert in negotiations',
      type: AgentType.Interviewer,
      img_url: '../../../../../../assets/images/agents-images/Salah.png'
    },
    {
      id: '2',
      name: 'Amjad',
      description: 'Specialist in data analysis',
      type: AgentType.Summarizer,
      img_url: '../../../../../../assets/images/agents-images/Amjad.png'
    },
    {
      id: '3',
      name: 'Sarah',
      description: 'Expert in negotiations',
      type: AgentType.RAG_Agent,
      img_url: '../../../../../../assets/images/agents-images/Sarah.png'
    },
    {
      id: '4',
      name: 'Khaled',
      description: 'Specialist in data analysis',
      type: AgentType.Responder,
      img_url: '../../../../../../assets/images/agents-images/Khaled.png'
    }
  ];
}

CurrentPagePath(): RouteLink[]{
  return [
    { path: `/${this.lang()}/agents`, label: 'AI Agents' }
  ];
}
}
