import { InjectionToken } from '@angular/core';
import { AgentsRepository } from '../../domain/repositories/agents.repository';

export const AGENTS_REPOSITORY = new InjectionToken<AgentsRepository>('AgentsRepository');