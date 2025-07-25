// src/app/features/agents/presentation/store/agents.selectors.ts

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AGENTS_FEATURE_KEY, AgentsState } from './agents.state';

export const selectAgentsState = createFeatureSelector<AgentsState>(AGENTS_FEATURE_KEY);

export const selectAllAgents = createSelector(
  selectAgentsState,
  (state: AgentsState) => state.agents
);

export const selectSelectedAgent = createSelector(
  selectAgentsState,
  (state: AgentsState) => state.selectedAgent
);

export const selectAgentsLoading = createSelector(
  selectAgentsState,
  (state: AgentsState) => state.loading
);

export const selectAgentsError = createSelector(
  selectAgentsState,
  (state: AgentsState) => state.error
);

export const selectAgentById = (id: string) => createSelector(
  selectAllAgents,
  (agents) => agents.find(agent => agent.id === id)
);