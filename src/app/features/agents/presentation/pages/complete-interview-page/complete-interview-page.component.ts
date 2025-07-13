
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { filter, tap } from 'rxjs';

// Shared Components
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';

// Facades
import { InterviewsFacade } from '../../facades/interviews.facade';
import { AgentsFacade } from '../../facades/agents.facade';

// Entities
import { InterviewEntity } from '../../../domain/entities/interview.entity';
import { AgentEntity } from '../../../domain/entities/agent.entity';

// Enums
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
import { MainPageStructureComponent } from '../../../../../shared/components/main-page-structure/main-page-structure.component';

@Component({
  selector: 'app-complete-interview-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MainPageStructureComponent
  ],
  templateUrl: './complete-interview-page.component.html',
  styleUrl: './complete-interview-page.component.scss',
})
export class CompleteInterviewPageComponent implements OnInit {
  SideNavTabs = SideNavTabs;
  
  // Input signals for route parameters
  lang = input.required<string>();
  id = input.required<string>(); // agent id

  // Component state
  selectedAgent: AgentEntity | null = null;
  selectedInterview: InterviewEntity | null = null;
  interviewId: string | null = null;
  completionDate: string | null = null;

  // Observables
  agent$;
  agentLoading$;
  interview$;
  interviewLoading$;

  constructor(
    private agentsFacade: AgentsFacade,
    private interviewsFacade: InterviewsFacade,
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    // Initialize observables
    this.agent$ = this.agentsFacade.selectedAgent$;
    this.agentLoading$ = this.agentsFacade.loading$;
    this.interview$ = this.interviewsFacade.selectedInterview$;
    this.interviewLoading$ = this.interviewsFacade.loading$;
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupSubscriptions();
    this.parseQueryParameters();
  }

  private loadInitialData(): void {
    const agentId = this.id();
    
    // Load agent details
    this.agentsFacade.loadAgent(agentId);
    
    // Load interview if interviewId is available
    if (this.interviewId) {
      this.interviewsFacade.loadInterview(this.interviewId);
    }
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

    // Subscribe to interview changes
    this.interview$
      .pipe(
        filter((interview) => interview !== null),
        takeUntilDestroyed(this.destroyRef),
        tap((interview) => {
          this.selectedInterview = interview;
        })
      )
      .subscribe();
  }

  private parseQueryParameters(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.interviewId = params.get('interview-id');
        this.completionDate = params.get('completeDate');
        
        // Reload interview if interviewId is available
        if (this.interviewId) {
          this.interviewsFacade.loadInterview(this.interviewId);
        }
      });
  }

  exitInterview(): void {
    // Navigate back to agent details page
    this.router.navigate([`/${this.lang()}/agents/agent/${this.id()}`]);
  }

  getCurrentPagePath(): RouteLink[] {
    return [
      { path: `/${this.lang()}/agents`, label: 'AI Agents' },
      { path: `/${this.lang()}/agents/agent/${this.id()}`, label: this.selectedAgent?.name || 'Agent Details' },
      { path: `/${this.lang()}/agents/agent/${this.id()}/complete-interview`, label: 'Interview Completed' }
    ];
  }

  getFormattedDate(): string {
    if (this.completionDate) {
      return new Date(this.completionDate).toLocaleDateString();
    }
    return new Date().toLocaleDateString();
  }

  getInterviewDisplayId(): string {
    return this.interviewId ? `#${this.interviewId.slice(-8)}` : '#XXXXXXXX';
  }
}