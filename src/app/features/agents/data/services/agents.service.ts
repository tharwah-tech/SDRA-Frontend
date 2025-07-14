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
    // Remove trailing slash to prevent double slashes in URL construction
    this.apiUrl = `${this.baseUrl}/agents_lab/agents`;
  }

  getAgents(): Observable<AgentSummaryEntity[]> {
    // Add trailing slash for the list endpoint
    const respone = this.http.get<
      ApiResponse<PaginatedModel<AgentSummaryModel>>
    >(`${this.apiUrl}/`);
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
    const response$ = this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/${id}/`
    );
    
    return handleResponse<any, AgentEntity>(
      response$,
      this.mapModelToEntity.bind(this)
    );
  }

  createAgent(agent: Partial<AgentEntity>): Observable<AgentEntity> {
    return this.http
      .post<AgentModel>(`${this.apiUrl}/`, agent)
      .pipe(map(this.mapModelToEntity));
  }

  updateAgent(
    id: string,
    agent: Partial<AgentEntity>
  ): Observable<AgentEntity> {
    return this.http
      .put<AgentModel>(`${this.apiUrl}/${id}/`, agent)
      .pipe(map(this.mapModelToEntity));
  }

  deleteAgent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  configureAgent(id: string, configuration: any): Observable<AgentEntity> {
    return this.http
      .post<AgentModel>(`${this.apiUrl}/${id}/configure/`, configuration)
      .pipe(map(this.mapModelToEntity));
  }

  // Mapper function to transform API model to domain entity
  private mapModelToEntity(model: any): AgentEntity {
    return {
      id: model.id,
      name: model.name,
      role: this.mapApiTypeToRole(model.type), // Convert API type to proper role
      description: model.description,
      avatarUrl: model.img_url, // API returns 'img_url' but entity expects 'avatarUrl'
      personality: model.personality?.map((p: any) => ({
        id: p.id,
        trait: p.name, // API returns 'name' but entity expects 'trait'
      })) || [],
      supportedOutputs: model.supported_output?.map((output: any) => ({
        id: output.id,
        type: output.name, // API returns 'name' but entity expects 'type'
        isEnabled: true, // Default to true since API doesn't provide this
      })) || [],
      isActive: true, // Default to true since API doesn't provide this
      createdAt: model.created_at ? new Date(model.created_at) : undefined,
      updatedAt: model.updated_at ? new Date(model.updated_at) : undefined,
    };
  }

  // Helper method to convert API type to proper role
  private mapApiTypeToRole(apiType: string): string {
    switch (apiType?.toLowerCase()) {
      case 'interviewer':
        return 'Interviewer';
      case 'summarizer':
        return 'Summarizer';
      case 'rag agent':
        return 'RAG Agent';
      case 'responder':
        return 'Responder';
      default:
        return apiType || 'Unknown';
    }
  }
}