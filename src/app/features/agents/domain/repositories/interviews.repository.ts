
import { Observable } from 'rxjs';
import { InterviewEntity, InterviewsResponse } from '../entities/interview.entity';

export abstract class InterviewsRepository {
  abstract getInterviews(): Observable<InterviewsResponse>;
  abstract getInterviewById(id: string): Observable<InterviewEntity>;
  abstract updateInterviewStatus(id: string, status: string): Observable<InterviewEntity>;
  abstract deleteInterview(id: string): Observable<void>;
}