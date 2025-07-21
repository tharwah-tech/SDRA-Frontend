import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { InterviewsRepository } from '../../domain/repositories/interviews.repository';
import {
  InterviewEntity,
  InterviewsResponse,
  InterviewStatus,
} from '../../domain/entities/interview.entity';
import {
  CreateInterviewModel,
  InterviewLinkResponse,
  InterviewModel,
  ShareTokenResponse,
} from '../models/interview.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { PaginatedModel } from '../../../../core/models/paginated.model';
import { handleResponse } from '../../../../shared/utils/handle-reponses.util';
import { BASE_API_URL } from '../../../../app.config';
import {
  InterviewDetailsEntity,
  JobInfo,
  InterviewcontentDetails,
} from '../../domain/entities/interview-details.entity';
import { InterviewDetailsModel } from '../models/interview-details.model';
import { CreateInteviewEntity } from '../../domain/entities/create-interview.entity';

@Injectable({
  providedIn: 'root',
})
export class InterviewsService implements InterviewsRepository {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(BASE_API_URL) private baseUrl: string
  ) {
    this.apiUrl = `${this.baseUrl}/agents_lab/interviews`;
  }

  getInterviews(): Observable<InterviewsResponse> {
    const response$ = this.http.get<
      ApiResponse<PaginatedModel<InterviewModel>>
    >(this.apiUrl);

    return handleResponse<PaginatedModel<InterviewModel>, InterviewsResponse>(
      response$,
      this.mapPaginatedModelToEntity.bind(this)
    );
  }

  getInterviewById(id: string): Observable<InterviewDetailsEntity> {
    const response$ = this.http.get<ApiResponse<InterviewDetailsModel>>(
      `${this.apiUrl}/${id}`
    );

    return handleResponse<InterviewDetailsModel, InterviewDetailsEntity>(
      response$,
      this.mapDetailsModelToEntity.bind(this)
    );
  }
  createInterview(
    interview: CreateInteviewEntity
  ): Observable<{ interviewId: string }> {
    const url = `${this.apiUrl}/create/`;
    const response = this.http.post<ApiResponse<CreateInterviewModel>>(
      url,
      interview
    );
    return handleResponse<CreateInterviewModel, { interviewId: string }>(
      response,
      (model) => {
        return { interviewId: model.interview_id };
      }
    );
  }

  updateInterviewStatus(
    id: string,
    status: string
  ): Observable<InterviewDetailsEntity> {
    const response$ = this.http.patch<ApiResponse<InterviewDetailsModel>>(
      `${this.apiUrl}/${id}`,
      { status }
    );

    return handleResponse<InterviewDetailsModel, InterviewDetailsEntity>(
      response$,
      this.mapDetailsModelToEntity.bind(this)
    );
  }

  getShareToken(interviewId: string): Observable<string> {
    const formData = new FormData();
    formData.append('interview_id', interviewId);

    // Don't set Content-Type header for FormData - browser will set it automatically
    const response$ = this.http.post<ApiResponse<ShareTokenResponse>>(
      `${this.apiUrl}/share/`,
      {
        interview_id: interviewId,
      }
    );
    response$
      .pipe(tap((response) => console.log('response$: ', response.data.token)))
      .subscribe();

    return handleResponse<ShareTokenResponse, string>(
      response$,
      (model) => model.token
    );
  }

  getInterviewLink(token: string): Observable<string> {
    const response$ = this.http.get<ApiResponse<InterviewLinkResponse>>(
      `${this.apiUrl}/link/?token=${token}`
    );

    return handleResponse<InterviewLinkResponse, string>(
      response$,
      (model) => model.interview_url
    );
  }

  deleteInterview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Private mapper methods
  private mapPaginatedModelToEntity(
    paginatedModel: PaginatedModel<InterviewModel>
  ): InterviewsResponse {
    return {
      totalCount: paginatedModel.total_count,
      pagesCount: paginatedModel.pages_count,
      currentPage: paginatedModel.current_page,
      currentPageSize: paginatedModel.current_page_size,
      results: paginatedModel.results.map(this.mapModelToEntity.bind(this)),
    };
  }

  private mapModelToEntity(model: InterviewModel): InterviewEntity {
    return {
      id: model.id,
      candidateName: model.candidate_name,
      jobTitle: model.job_title,
      creationDate: new Date(model.creation_date),
      status: this.mapStringToStatus(model.status),
    };
  }

  private mapDetailsModelToEntity(
    model: InterviewDetailsModel
  ): InterviewDetailsEntity {
    return {
      id: model.id,
      creation_date: model.created_date,
      status: model.status,
      candidate_info: {
        full_name: model.candidate_name,
        email: model.candidate_email,
        phone: model.candidate_phone,
        gender: model.candidate_gender,
      },
      job_info: {
        title: model.job_title,
        contract_type: model.job_contract_type,
        job_description: model.job_description,
        job_requirements: model.job_requirements,
      } as JobInfo,
      questions: model.questions,
      interview_content_details: {
        interview_summary: model.interview_summary,
        interview_record_url: model.interview_record_url,
        interview_start_time: model.interview_start_time,
        interview_end_time: model.interview_end_time,
      },
      transcriptions: model.transcriptions,
    } as InterviewDetailsEntity;
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
