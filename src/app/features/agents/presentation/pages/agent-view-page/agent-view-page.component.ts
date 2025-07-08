import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { AgentCardComponent } from '../../components/agent-card/agent-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AgentsFacade } from '../../facades/agents.facade';
import { filter, takeUntil, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AgentEntity } from '../../../domain/entities/agent.entity';
@Component({
  selector: 'app-agent-view-page',
  imports: [CommonModule, AgentCardComponent, MatProgressSpinnerModule],
  templateUrl: './agent-view-page.component.html',
  styleUrl: './agent-view-page.component.scss',
})
export class AgentViewPageComponent implements OnInit {
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
}


