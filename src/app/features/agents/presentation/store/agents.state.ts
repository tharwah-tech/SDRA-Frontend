import { AgentEntity } from '../../domain/entities/agent.entity';

export interface AgentsState {
  agents: AgentEntity[];
  selectedAgent: AgentEntity | null;
  loading: boolean;
  error: string | null;
}

export const initialAgentsState: AgentsState = {
  agents: [],
  selectedAgent: null,
  loading: false,
  error: null
};