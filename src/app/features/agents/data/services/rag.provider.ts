import { InjectionToken } from '@angular/core';
import { RagRepository } from '../../domain/repositories/rag.repository';
import { RagService } from './rag.service';

export const RAGS_REPOSITORY = new InjectionToken<RagRepository>('RagsRepository');

export const provideRagsRepository = () => ({
  provide: RAGS_REPOSITORY,
  useClass: RagService,
});
