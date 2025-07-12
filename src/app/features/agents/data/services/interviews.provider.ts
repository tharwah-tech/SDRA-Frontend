
import { InjectionToken } from '@angular/core';
import { InterviewsRepository } from '../../domain/repositories/interviews.repository';

// Feature-level injection token for interviews repository
export const INTERVIEWS_REPOSITORY = new InjectionToken<InterviewsRepository>('InterviewsRepository');

// Note: This token is used only within the agents feature module
// It's provided in agents.providers.ts at the feature level, not globally