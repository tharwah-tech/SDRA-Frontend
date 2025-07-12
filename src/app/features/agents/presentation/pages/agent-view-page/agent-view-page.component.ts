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
import { InterviewListComponent } from '../../components/interview-list/interview-list/interview-list.component';

@Component({
  selector: 'app-agent-view-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    AgentCardComponent,
    InterviewListComponent
  ],
  templateUrl: './agent-view-page.component.html',
  styleUrl: './agent-view-page.component.scss',
})
export class AgentViewPageComponent implements OnInit {
  // Agent-related observables
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

  // Public methods for component actions
  onRefreshData(): void {
    this.loadInitialData();
  }

  onEditAgent(): void {
    if (this.selectedAgent) {
      console.log('Navigate to edit agent:', this.selectedAgent.id);
      // Implement navigation to edit agent page
      // this.router.navigate(['/agents/edit', this.selectedAgent.id]);
    }
  }

  onDeleteAgent(): void {
    if (this.selectedAgent) {
      const confirmMessage = `Are you sure you want to delete the agent "${this.selectedAgent.name}"?`;
      if (confirm(confirmMessage)) {
        console.log('Delete agent:', this.selectedAgent.id);
        // Implement agent deletion
        // this.agentsFacade.deleteAgent(this.selectedAgent.id);
      }
    }
  }

  onConfigureAgent(): void {
    if (this.selectedAgent) {
      console.log('Configure agent:', this.selectedAgent.id);
      // Implement agent configuration
      // this.router.navigate(['/agents/configure', this.selectedAgent.id]);
    }
  }

  // Computed properties for template
  get hasLoadingState(): boolean {
    return !!(this.agentLoading$ || this.interviewsLoading$);
  }

  get hasErrorState(): boolean {
    return !!(this.agentError$ || this.interviewsError$);
  }

  get isDataLoaded(): boolean {
    return !!this.selectedAgent;
  }
}