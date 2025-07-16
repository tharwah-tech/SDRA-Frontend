import { AgentType } from './../../../../../core/enums/agents-type.enum';
// src/app/features/agents/presentation/pages/agent-view-page/agent-view-page.component.ts

import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { filter, Observable, tap } from 'rxjs';

// Components
import { AgentCardComponent } from '../../components/agent-card/agent-card.component';
import { InterviewListComponent } from '../../components/interview-list/interview-list/interview-list.component';

// Facades
import { AgentsFacade } from '../../facades/agents.facade';
import { InterviewsFacade } from '../../facades/interviews.facade';

// Entities
import { AgentEntity } from '../../../domain/entities/agent.entity';
import { MainPageStructureComponent } from '../../../../../shared/components/main-page-structure/main-page-structure.component';
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
import { MatCardModule } from '@angular/material/card';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';
import { ToastrService } from 'ngx-toastr';
import { RAGReferenceDocumentsCardComponent } from '../../components/rag-reference-documents-card/rag-reference-documents-card.component';

@Component({
  selector: 'app-agent-view-page',
  imports: [
    CommonModule,
    AgentCardComponent,
    InterviewListComponent, // Add this import
    RAGReferenceDocumentsCardComponent,
    MatProgressSpinnerModule,
    MainPageStructureComponent,
    MatCardModule,
  ],
  templateUrl: './agent-view-page.component.html',
  styleUrl: './agent-view-page.component.scss',
})
export class AgentViewPageComponent implements OnInit {
  SideNavTabs = SideNavTabs;
  AgentType = AgentType;
  lang = input.required<string>();

  // Agent observables
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
    private toastr: ToastrService,
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
    this.agentError$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((val) => !!val),
        tap((error) => showSnackbar(this.toastr, { type: 'error', error }))
      )
      .subscribe();
    this.interviewsError$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((val) => !!val),
        tap((error) => showSnackbar(this.toastr, { type: 'error', error }))
      )
      .subscribe();
  }

  private loadInitialData(): void {
    const agentId = this.id();

    // Load agent details
    this.agentsFacade.loadAgent(agentId);

    // Load interviews (could be filtered by agentId in future)
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

  CurrentPagePath(): RouteLink[] {
    return [
      { path: `/${this.lang()}/agents`, label: 'AI Agents' },
      {
        path: `/${this.lang()}/agents/agent/${this.id()}`,
        label: this.selectedAgent?.name || 'Agent Details',
      },
    ];
  }
}
