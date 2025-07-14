import { Injectable, Inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AgentsRepository } from '../../domain/repositories/agents.repository';
import { AGENTS_REPOSITORY } from '../../data/services/agents.provider';
import { AgentDto, AgentSummaryDto } from '../dtos/agent.dto';
import { AgentMapper } from '../mappers/agent.mapper';
import { AgentSummaryEntity } from '../../domain/entities/agent.entity';

@Injectable({
  providedIn: 'root'
})
export class GetAgentsUseCaseService {
  constructor(
    @Inject(AGENTS_REPOSITORY) private agentsRepository: AgentsRepository
  ) {}

  execute(): Observable<AgentSummaryEntity[]> {
    return this.agentsRepository.getAgents().pipe(
      map(agents => agents)
    );
  }
}
