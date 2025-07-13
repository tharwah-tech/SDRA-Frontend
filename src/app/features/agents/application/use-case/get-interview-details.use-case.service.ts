import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INTERVIEWS_REPOSITORY } from '../../data/services/interviews.provider';
import { InterviewDetailsEntity } from '../../domain/entities/interview-details.entity';
import { InterviewsRepository } from '../../domain/repositories/interviews.repository';

@Injectable({
  providedIn: 'root'
})
export class GetInterviewDetailsUseCaseService {

  constructor(@Inject(INTERVIEWS_REPOSITORY) private interviewsRepository: InterviewsRepository) {}

  execute(id: string): Observable<InterviewDetailsEntity> {
    console.log('Executing GetInterviewsUseCaseService');
    return this.interviewsRepository.getInterviewById(id);
  }
}
