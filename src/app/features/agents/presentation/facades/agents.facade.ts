
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AgentEntity, AgentSummaryEntity } from '../../domain/entities/agent.entity';
import { selectAllAgents, selectSelectedAgent, selectAgentsLoading, selectAgentsError } from '../store/agents/agents.selectors';
import { AgentsActions } from '../store/agents/agents.actions';
import { ApiError } from '../../../../core/models/api-error.model';

@Injectable({
  providedIn: 'root'
})
export class AgentsFacade {
  agents$: Observable<AgentSummaryEntity[]>;
  selectedAgent$: Observable<AgentEntity | null>;
  loading$: Observable<boolean>;
  error$: Observable<ApiError | null>;

  constructor(private store: Store) {
    this.agents$ = this.store.select(selectAllAgents);
    this.selectedAgent$ = this.store.select(selectSelectedAgent);
    this.loading$ = this.store.select(selectAgentsLoading);
    this.error$ = this.store.select(selectAgentsError);
  }

  loadAgents(): void {
    this.store.dispatch(AgentsActions.loadAgents());
  }

  loadAgent(id: string): void {
    this.store.dispatch(AgentsActions.loadAgent({ id }));
  }



  clearSelectedAgent(): void {
    this.store.dispatch(AgentsActions.clearSelectedAgent());
  }


}
