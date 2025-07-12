// src/app/features/agents/presentation/pages/agent-view-page/agent-view-page.component.ts

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, tap } from 'rxjs';

// Components
import { AgentCardComponent } from '../../components/agent-card/agent-card.component';

// Facades
import { AgentsFacade } from '../../facades/agents.facade';
import { InterviewsFacade } from '../../facades/interviews.facade';

// Entities
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
  agentLoading$;
  agentError$;
  
  // Interview-related observables
  interviews$;
  interviewsLoading$;
  interviewsError$;
  interviewsCount$;
  
  // Component state
  selectedAgent: AgentEntity | null = null;
  id = input.required<string>();

  constructor(
    private agentsFacade: AgentsFacade,
    private interviewsFacade: InterviewsFacade,
    private destroyRef: DestroyRef
  ) {
    // Initialize observables after services are injected
    this.agent$ = this.agentsFacade.selectedAgent$;
    this.agentLoading$ = this.agentsFacade.loading$;
    this.agentError$ = this.agentsFacade.error$;

    this.interviews$ = this.interviewsFacade.interviews$;
    this.interviewsLoading$ = this.interviewsFacade.loading$;
    this.interviewsError$ = this.interviewsFacade.error$;
    this.interviewsCount$ = this.interviewsFacade.count$;
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupSubscriptions();
  }

  private loadInitialData(): void {
    const agentId = this.id();
    
    // Load agent details
    this.agentsFacade.loadAgent(agentId);
    
    // Load interviews (in a real app, you might filter by agent)
    this.interviewsFacade.loadInterviews();
  }

  private setupSubscriptions(): void {
    // Subscribe to agent changes
    this.agent$
      .pipe(
        filter((agent) => agent !== null),
        takeUntilDestroyed(this.destroyRef),
        tap((agent) => {
          this.selectedAgent = agent;
        })
      )
      .subscribe();

    // Handle agent loading errors
    this.agentError$
      .pipe(
        filter((error: any) => error !== null),
        takeUntilDestroyed(this.destroyRef),
        tap((error: any) => {
          console.error('Agent loading error:', error);
        })
      )
      .subscribe();

    // Handle interview loading errors
    this.interviewsError$
      .pipe(
        filter((error: any) => error !== null),
        takeUntilDestroyed(this.destroyRef),
        tap((error: any) => {
          console.error('Interviews loading error:', error);
        })
      )
      .subscribe();
  }
  CurrentPagePath(): RouteLink[]{
    return [
      { path: `/${this.lang()}/agents`, label: 'AI Agents' },
      { path: `/${this.lang()}/agents/agent/${this.id()}`, label: this.selectedAgent?.name || 'Agent Details' }
    ];
  }
}


