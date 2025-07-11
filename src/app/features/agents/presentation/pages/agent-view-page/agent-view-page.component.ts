import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { AgentCardComponent } from '../../components/agent-card/agent-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AgentsFacade } from '../../facades/agents.facade';
import { filter, takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AgentEntity } from '../../../domain/entities/agent.entity';
import { MainPageStructureComponent } from "../../../../../shared/components/main-page-structure/main-page-structure.component";
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
@Component({
  selector: 'app-agent-view-page',
  imports: [CommonModule, AgentCardComponent, MatProgressSpinnerModule, MainPageStructureComponent],
  templateUrl: './agent-view-page.component.html',
  styleUrl: './agent-view-page.component.scss',
})
export class AgentViewPageComponent implements OnInit {
  SideNavTabs = SideNavTabs;
  lang = input.required<string>();
  agent$;
  selectedAgent: AgentEntity | null = null;
  loading$;
  error$;
  id = input.required<string>();
  constructor(
    private agentsFacade: AgentsFacade,
    private destroyRef: DestroyRef
  ) {
    this.agent$ = this.agentsFacade.selectedAgent$;
    this.loading$ = this.agentsFacade.loading$;
    this.error$ = this.agentsFacade.error$;
  }

  ngOnInit(): void {
    this.agentsFacade.loadAgent(this.id());
    this.agent$
      .pipe(
        filter((agent) => agent !== null),
        takeUntilDestroyed(this.destroyRef),
        tap((agent) => {
          this.selectedAgent = agent;
        }
      ))
      .subscribe();
  }
  CurrentPagePath(): RouteLink[]{
    return [
      { path: `/${this.lang()}/agents`, label: 'AI Agents' },
      { path: `/${this.lang()}/agents/agent/${this.id()}`, label: this.selectedAgent?.name || 'Agent Details' }
    ];
  }
}


