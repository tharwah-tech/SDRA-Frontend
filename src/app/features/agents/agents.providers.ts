import { EnvironmentProviders } from '@angular/core';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

// Agents
import { AgentsRepository } from './domain/repositories/agents.repository';
import { AgentsService } from './data/services/agents.service';
import { AgentsMockService } from './data/services/agents-mock.service';
import { AGENTS_REPOSITORY } from './data/services/agents.provider';
import { agentsReducer } from './presentation/store/agents/agents.reducer';
import { AgentsEffects } from './presentation/store/agents/agents.effects';
import { AGENTS_FEATURE_KEY } from './presentation/store/agents/agents.state';

// Interviews
import { InterviewsRepository } from './domain/repositories/interviews.repository';
import { InterviewsService } from './data/services/interviews.service';
import { INTERVIEWS_REPOSITORY } from './data/services/interviews.provider';
import { interviewsReducer } from './presentation/store/interviews/interviews.reducer';
import { InterviewsEffects } from './presentation/store/interviews/interviews.effects';
import { INTERVIEWS_FEATURE_KEY } from './presentation/store/interviews/interviews.state';

// Use Cases
import { GetAgentsUseCaseService } from './application/use-case/get-agents.use-case.service';
import { GetAgentByIdUseCaseService } from './application/use-case/get-agent-by-id.use-case.service';
import { ConfigureAgentUseCaseService } from './application/use-case/configure-agent.use-case.service';
import { GetInterviewsUseCaseService } from './application/use-case/get-interviews.use-case.service';

// Environment
import { environment } from '../../../environments/environment';
import { InterviewShareService } from './data/services/interview-share.service';
import { GetInterviewDetailsUseCaseService } from './application/use-case/get-interview-details.use-case.service';

export const agentsFeatureProviders = [
  // ✅ 1. FIRST: Provide all services that effects depend on

  // Repository Implementations
  {
    provide: AGENTS_REPOSITORY,
    useClass: environment.production ? AgentsService : AgentsMockService,
  },
  {
    provide: INTERVIEWS_REPOSITORY,
    useClass: InterviewsService,
  },

  // Use Case Services
  GetAgentsUseCaseService,
  GetAgentByIdUseCaseService,
  ConfigureAgentUseCaseService,
  GetInterviewsUseCaseService,
  GetInterviewDetailsUseCaseService,

  // Direct Service Providers
  InterviewsService,
  AgentsService,
  AgentsMockService,
  InterviewShareService,
  // ✅ 2. SECOND: Provide the store state
  provideState(AGENTS_FEATURE_KEY, agentsReducer),
  provideState(INTERVIEWS_FEATURE_KEY, interviewsReducer),

  // ✅ 3. LAST: Provide effects AFTER all dependencies are available
  provideEffects([AgentsEffects, InterviewsEffects]),
];
