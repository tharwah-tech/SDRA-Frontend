import { ApiResponse } from './../../../../core/models/api-response.model';

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AgentsRepository } from '../../domain/repositories/agents.repository';
import {
  AgentEntity,
  AgentSummaryEntity,
} from '../../domain/entities/agent.entity';
import { AgentModel, AgentSummaryModel } from '../models/agent.model';
import { BASE_API_URL } from '../../../../app.config';
import { PaginatedModel } from '../../../../core/models/paginated.model';
import { handleResponse } from '../../../../shared/utils/handle-reponses.util';

@Injectable({
  providedIn: 'root',
})
export class AgentsService implements AgentsRepository {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(BASE_API_URL) private baseUrl: string
  ) {
    this.apiUrl = `${this.baseUrl}/agents_lab/agents/`;
  }

  getAgents(): Observable<AgentSummaryEntity[]> {
    const respone = this.http.get<
      ApiResponse<PaginatedModel<AgentSummaryModel>>
    >(this.apiUrl);
    return handleResponse<
      PaginatedModel<AgentSummaryModel>,
      AgentSummaryEntity[]
    >(respone, (paginatedModle) => {
      return paginatedModle.results.map((model) => {
        return {
          id: model.id,
          name: model.name,
          description: model.description,
          type: model.type,
          img_url: model.img_url,
        } as AgentSummaryEntity;
      });
    });
  }

  getAgentById(id: string): Observable<AgentEntity> {
    return this.http
      .get<AgentModel>(`${this.apiUrl}/${id}`)
      .pipe(map(this.mapModelToEntity));
  }

  createAgent(agent: Partial<AgentEntity>): Observable<AgentEntity> {
    return this.http
      .post<AgentModel>(this.apiUrl, agent)
      .pipe(map(this.mapModelToEntity));
  }

  updateAgent(
    id: string,
    agent: Partial<AgentEntity>
  ): Observable<AgentEntity> {
    return this.http
      .put<AgentModel>(`${this.apiUrl}/${id}`, agent)
      .pipe(map(this.mapModelToEntity));
  }

  deleteAgent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  configureAgent(id: string, configuration: any): Observable<AgentEntity> {
    return this.http
      .post<AgentModel>(`${this.apiUrl}/${id}/configure`, configuration)
      .pipe(map(this.mapModelToEntity));
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
      updatedAt: model.updatedAt ? new Date(model.updatedAt) : undefined,
    };
  }
}
