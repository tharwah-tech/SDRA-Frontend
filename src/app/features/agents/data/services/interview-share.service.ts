import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { BASE_API_URL } from '../../../../app.config';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { handleResponse } from '../../../../shared/utils/handle-reponses.util';

// Response interfaces for the API calls
interface ShareTokenResponse {
  token: string;
}

interface InterviewLinkResponse {
  interview_url: string;
}

export interface InterviewShareResult {
  interviewUrl: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewShareService {
  private readonly baseShareUrl: string;
  private readonly headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    @Inject(BASE_API_URL) private baseUrl: string
  ) {
    this.baseShareUrl = `${this.baseUrl}/agents_lab/interviews`;
    this.headers = new HttpHeaders();
  }

  /**
   * Gets the interview share token and then fetches the interview URL
   * @param interviewId - The ID of the interview to share
   * @returns Observable<InterviewShareResult> - Contains both token and interview URL
   */
  getInterviewShareUrl(interviewId: string): Observable<InterviewShareResult> {
    return this.getShareToken(interviewId).pipe(
      switchMap(token => 
        this.getInterviewLink(token).pipe(
          map(interviewUrl => ({
            interviewUrl,
            token
          }))
        )
      )
    );
  }

  /**
   * Step 1: Get the share token for the interview
   * @param interviewId - The ID of the interview
   * @returns Observable<string> - The token
   * NOTE: Now PUBLIC method to be used in interview-list.component.ts
   */
  getShareToken(interviewId: string): Observable<string> {
    const formData = new FormData();
    formData.append('interview_id', interviewId);

    // Don't set Content-Type header for FormData - browser will set it automatically
    const response$ = this.http.post<ApiResponse<ShareTokenResponse>>(
      `${this.baseShareUrl}/share/`,
      formData,
      { headers: this.headers }
    );
    console.log('resoinse$', response$.pipe(
      map(response => response.data.token)));
    return handleResponse<ShareTokenResponse, string>(
      response$,
      (model) => model.token
    );
  }

  /**
   * Step 2: Get the interview URL using the token
   * @param token - The token from step 1
   * @returns Observable<string> - The interview URL
   * NOTE: Now PUBLIC method to be used in start-interview-page.component.ts
   */
  getInterviewLink(token: string): Observable<string> {
    const response$ = this.http.get<ApiResponse<InterviewLinkResponse>>(
      `${this.baseShareUrl}/link/?token=${token}`,
      { headers: this.headers }
    );

    return handleResponse<InterviewLinkResponse, string>(
      response$,
      (model) => model.interview_url
    );
  }
}