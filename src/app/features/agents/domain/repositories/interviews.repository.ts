
import { Observable } from 'rxjs';
import { InterviewEntity, InterviewsResponse } from '../entities/interview.entity';
import { InterviewDetailsEntity } from '../entities/interview-details.entity';

export abstract class InterviewsRepository {
  abstract getInterviews(): Observable<InterviewsResponse>;
  abstract getInterviewById(id: string): Observable<InterviewDetailsEntity>;
  abstract updateInterviewStatus(id: string, status: string): Observable<InterviewDetailsEntity>;
  abstract deleteInterview(id: string): Observable<void>;
}
