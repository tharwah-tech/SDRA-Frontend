
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AgentsRepository } from '../../domain/repositories/agents.repository';
import { AgentEntity } from '../../domain/entities/agent.entity';
import { AgentModel } from '../models/agent.model';
import { BASE_API_URL } from '../../../../app.config';

@Injectable({
  providedIn: 'root'
})
export class AgentsService implements AgentsRepository {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(BASE_API_URL) private baseUrl: string
  ) {
    this.apiUrl = `${this.baseUrl}/agents`;
  }

  getAgents(): Observable<AgentEntity[]> {
    return this.http.get<AgentModel[]>(this.apiUrl).pipe(
      map(agents => agents.map(this.mapModelToEntity))
    );
  }

  getAgentById(id: string): Observable<AgentEntity> {
    return this.http.get<AgentModel>(`${this.apiUrl}/${id}`).pipe(
      map(this.mapModelToEntity)
    );
  }

  createAgent(agent: Partial<AgentEntity>): Observable<AgentEntity> {
    return this.http.post<AgentModel>(this.apiUrl, agent).pipe(
      map(this.mapModelToEntity)
    );
  }

  updateAgent(id: string, agent: Partial<AgentEntity>): Observable<AgentEntity> {
    return this.http.put<AgentModel>(`${this.apiUrl}/${id}`, agent).pipe(
      map(this.mapModelToEntity)
    );
  }

  deleteAgent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  configureAgent(id: string, configuration: any): Observable<AgentEntity> {
    return this.http.post<AgentModel>(`${this.apiUrl}/${id}/configure`, configuration).pipe(
      map(this.mapModelToEntity)
    );
  }

  // Mapper function to transform API model to domain entity
  private mapModelToEntity(model: AgentModel): AgentEntity {
    return {
      id: model.id,
      name: model.name,
      role: model.role,
      description: model.description,
      avatarUrl: model.avatarUrl,
      personality: model.personality,
      supportedOutputs: model.supportedOutputs,
      isActive: model.isActive,
      createdAt: model.createdAt ? new Date(model.createdAt) : undefined,
      updatedAt: model.updatedAt ? new Date(model.updatedAt) : undefined
    };
  }
}