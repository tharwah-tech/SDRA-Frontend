import { AgentsState } from "./agents/agents.state";
import { InterviewsState } from "./interviews/interviews.state";



// Feature-level state interface
export interface AgentsFeatureState {
  agents: AgentsState;
  interviews: InterviewsState;
}

// Feature state keys
export const AGENTS_FEATURE_KEYS = {
  AGENTS: 'agents',
  INTERVIEWS: 'interviews'
} as const;