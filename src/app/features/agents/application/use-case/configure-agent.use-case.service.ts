
import { Injectable, Inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AgentsRepository } from '../../domain/repositories/agents.repository';
import { AGENTS_REPOSITORY } from '../../data/services/agents.provider';
import { AgentDto, ConfigureAgentDto } from '../dtos/agent.dto';
import { AgentMapper } from '../mappers/agent.mapper';

@Injectable({
  providedIn: 'root'
})
export class ConfigureAgentUseCaseService {
  constructor(
    @Inject(AGENTS_REPOSITORY) private agentsRepository: AgentsRepository
  ) {}

  execute(id: string, configuration: ConfigureAgentDto): Observable<AgentDto> {
    return this.agentsRepository.configureAgent(id, configuration).pipe(
      map(agent => AgentMapper.toDto(agent))
    );
  }
}