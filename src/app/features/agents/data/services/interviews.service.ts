
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InterviewsRepository } from '../../domain/repositories/interviews.repository';
import { InterviewEntity, InterviewsResponse, InterviewStatus } from '../../domain/entities/interview.entity';
import { InterviewModel } from '../models/interview.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { PaginatedModel } from '../../../../core/models/paginated.model';
import { handleResponse } from '../../../../shared/utils/handle-reponses.util';
import { BASE_API_URL } from '../../../../app.config';

@Injectable({
  providedIn: 'root'
})
export class InterviewsService implements InterviewsRepository {
  private readonly apiUrl: string;
  private readonly headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    @Inject(BASE_API_URL) private baseUrl: string
  ) {
    this.apiUrl = `${this.baseUrl}/agents_lab/interviews`;
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Token 0e1034d8fd7ca52f2e3a346117f9af22e6925111'
    });
  }

  getInterviews(): Observable<InterviewsResponse> {
    const response$ = this.http.get<ApiResponse<PaginatedModel<InterviewModel>>>(
      this.apiUrl, 
      { headers: this.headers }
    );
    
    return handleResponse<PaginatedModel<InterviewModel>, InterviewsResponse>(
      response$,
      this.mapPaginatedModelToEntity.bind(this)
    );
  }

  getInterviewById(id: string): Observable<InterviewEntity> {
    const response$ = this.http.get<ApiResponse<InterviewModel>>(
      `${this.apiUrl}/${id}`, 
      { headers: this.headers }
    );
    
    return handleResponse<InterviewModel, InterviewEntity>(
      response$,
      this.mapModelToEntity.bind(this)
    );
  }

  updateInterviewStatus(id: string, status: string): Observable<InterviewEntity> {
    const response$ = this.http.patch<ApiResponse<InterviewModel>>(
      `${this.apiUrl}/${id}`, 
      { status }, 
      { headers: this.headers }
    );
    
    return handleResponse<InterviewModel, InterviewEntity>(
      response$,
      this.mapModelToEntity.bind(this)
    );
  }

  deleteInterview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  // Private mapper methods
  private mapPaginatedModelToEntity(paginatedModel: PaginatedModel<InterviewModel>): InterviewsResponse {
    return {
      totalCount: paginatedModel.total_count,
      pagesCount: paginatedModel.pages_count,
      currentPage: paginatedModel.current_page,
      currentPageSize: paginatedModel.current_page_size,
      results: paginatedModel.results.map(this.mapModelToEntity.bind(this))
    };
  }

  private mapModelToEntity(model: InterviewModel): InterviewEntity {
    return {
      id: model.id,
      candidateName: model.candidate_name,
      jobTitle: model.job_title,
      creationDate: new Date(model.creation_date),
      status: this.mapStringToStatus(model.status)
    };
  }

  private mapStringToStatus(status: string): InterviewStatus {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return InterviewStatus.SCHEDULED;
      case 'processed':
        return InterviewStatus.PROCESSED;
      case 'in_progress':
        return InterviewStatus.IN_PROGRESS;
      case 'taken':
        return InterviewStatus.TAKEN;
      default:
        return InterviewStatus.SCHEDULED;
    }
  }
}