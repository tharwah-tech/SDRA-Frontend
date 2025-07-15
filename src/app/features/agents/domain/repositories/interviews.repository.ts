import { Observable } from 'rxjs';
import {
  InterviewEntity,
  InterviewsResponse,
} from '../entities/interview.entity';
import { InterviewDetailsEntity } from '../entities/interview-details.entity';
import { CreateInteviewEntity } from '../entities/create-interview.entity';

export abstract class InterviewsRepository {
  abstract getInterviews(): Observable<InterviewsResponse>;
  abstract getInterviewById(id: string): Observable<InterviewDetailsEntity>;
  abstract createInterview(
    interview: CreateInteviewEntity
  ): Observable<{ interviewId: string }>;
  abstract updateInterviewStatus(
    id: string,
    status: string
  ): Observable<InterviewDetailsEntity>;
  abstract deleteInterview(id: string): Observable<void>;
  abstract getShareToken(interviewId: string): Observable<string>;
  abstract getInterviewLink(token: string): Observable<string>;
}
