import { InterviewDetailsEntity } from '../../domain/entities/interview-details.entity';

export interface CreateInterviewDto
  extends Omit<InterviewDetailsEntity, 'id' | 'creation_date' | 'status'> {}
