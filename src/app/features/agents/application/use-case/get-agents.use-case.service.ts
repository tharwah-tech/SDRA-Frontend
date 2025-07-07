import { Injectable, Inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AgentsRepository } from '../../domain/repositories/agents.repository';
import { AGENTS_REPOSITORY } from '../../data/services/agents.provider';
import { AgentDto } from '../dtos/agent.dto';
import { AgentMapper } from '../mappers/agent.mapper';

@Injectable({
  providedIn: 'root'
})
export class GetAgentsUseCaseService {
  constructor(
    @Inject(AGENTS_REPOSITORY) private agentsRepository: AgentsRepository
  ) {}

  execute(): Observable<AgentDto[]> {
    return this.agentsRepository.getAgents().pipe(
      map(agents => AgentMapper.toDtoList(agents))
    );
  }
}