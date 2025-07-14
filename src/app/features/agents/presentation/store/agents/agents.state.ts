import { ApiError } from '../../../../../core/models/api-error.model';
import { AgentEntity, AgentSummaryEntity } from '../../../domain/entities/agent.entity';
export const AGENTS_FEATURE_KEY = 'agents';
export interface AgentsState {
  agents: AgentSummaryEntity[];
  selectedAgent: AgentEntity | null;
  loading: boolean;
  error: ApiError | null;
}

export const initialAgentsState: AgentsState = {
  agents: [],
  selectedAgent: null,
  loading: false,
  error: null
};
