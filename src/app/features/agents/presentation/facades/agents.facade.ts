// A facade service to simplify component interaction with the store

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AgentEntity } from '../../domain/entities/agent.entity';
import { AgentsActions } from '../store/agents.actions';
import { selectAllAgents, selectSelectedAgent, selectAgentsLoading, selectAgentsError } from '../store/agents.selectors';

@Injectable({
  providedIn: 'root'
})
export class AgentsFacade {
  agents$: Observable<AgentEntity[]>;
  selectedAgent$: Observable<AgentEntity | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

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