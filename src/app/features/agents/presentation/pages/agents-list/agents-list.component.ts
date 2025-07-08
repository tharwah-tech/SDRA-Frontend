// src/app/features/agents/presentation/pages/agents-list/agents-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentCardComponent } from '../../components/agent-card/agent-card.component';
import { AgentsFacade } from '../../facades/agents.facade';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-agents-list',
  standalone: true,
  imports: [
    CommonModule,
    AgentCardComponent,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="agents-container">
      <div *ngIf="loading$ | async" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="!(loading$ | async)" class="agents-grid">
        <app-agent-card 
          *ngFor="let agent of agents$ | async"
          [agent]="agent"
          (configureAgent)="onConfigureAgent($event)"
          (selectAgent)="onSelectAgent($event)">
        </app-agent-card>
      </div>
    </div>
  `,
  styles: [`
    .agents-container {
      padding: 2rem;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }
    
    .agents-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
      gap: 1.5rem;
    }
  `]
})
export class AgentsListComponent implements OnInit {
  agents$: typeof this.agentsFacade.agents$;
  loading$: typeof this.agentsFacade.loading$;

  constructor(private agentsFacade: AgentsFacade) {
    this.agents$ = this.agentsFacade.agents$;
    this.loading$ = this.agentsFacade.loading$;
  }

  ngOnInit(): void {
    this.agentsFacade.loadAgents();
  }

  onConfigureAgent(agentId: string): void {
    this.agentsFacade.configureAgent(agentId);
  }

  onSelectAgent(agent: any): void {
    this.agentsFacade.selectAgent(agent);
  }
}