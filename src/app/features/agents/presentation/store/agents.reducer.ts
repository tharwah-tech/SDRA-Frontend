
import { createReducer, on } from '@ngrx/store';
import { AgentsActions } from './agents.actions';
import { AgentsState, initialAgentsState } from './agents.state';

export const agentsReducer = createReducer(
  initialAgentsState,
  
  // Load agents
  on(AgentsActions.loadAgents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AgentsActions.loadAgentsSuccess, (state, { agents }) => ({
    ...state,
    agents,
    loading: false,
    error: null
  })),
  
  on(AgentsActions.loadAgentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load single agent
  on(AgentsActions.loadAgent, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AgentsActions.loadAgentSuccess, (state, { agent }) => ({
    ...state,
    selectedAgent: agent,
    loading: false,
    error: null
  })),
  
  on(AgentsActions.loadAgentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Select agent
  on(AgentsActions.selectAgent, (state, { agent }) => ({
    ...state,
    selectedAgent: agent
  })),
  
  on(AgentsActions.clearSelectedAgent, (state) => ({
    ...state,
    selectedAgent: null
  }))
);