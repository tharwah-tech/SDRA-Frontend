import { Observable } from 'rxjs';
import { AgentEntity, AgentSummaryEntity } from '../entities/agent.entity';

export abstract class AgentsRepository {
  abstract getAgents(): Observable<AgentSummaryEntity[]>;
  abstract getAgentById(id: string): Observable<AgentEntity>;
  abstract createAgent(agent: Partial<AgentEntity>): Observable<AgentEntity>;
  abstract updateAgent(id: string, agent: Partial<AgentEntity>): Observable<AgentEntity>;
  abstract deleteAgent(id: string): Observable<void>;
  abstract configureAgent(id: string, configuration: any): Observable<AgentEntity>;
}
