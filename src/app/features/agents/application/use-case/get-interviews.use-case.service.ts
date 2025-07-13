
import { Inject, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InterviewsRepository } from '../../domain/repositories/interviews.repository';
import { InterviewsResponse } from '../../domain/entities/interview.entity';
import { INTERVIEWS_REPOSITORY } from '../../data/services/interviews.provider';

@Injectable({
  providedIn: 'root'
})
export class GetInterviewsUseCaseService {
  constructor(@Inject(INTERVIEWS_REPOSITORY) private interviewsRepository: InterviewsRepository) {}

  execute(): Observable<InterviewsResponse> {
    console.log('Executing GetInterviewsUseCaseService');
    return this.interviewsRepository.getInterviews();
  }
}
