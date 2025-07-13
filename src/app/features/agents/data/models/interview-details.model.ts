import { InterviewStatus } from '../../domain/entities/interview.entity';

export interface InterviewDetailsModel {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  candidate_gender: string;
  job_title: string;
  job_contract_type: string;
  job_description: string;
  job_requirements: string;
  interview_summary: string | null;
  interview_record_url: string | null;
  interview_start_time: Date | null;
  interview_end_time: Date | null;
  status: string;
  created_date: Date;
  questions: QuestionModel[];
  transcriptions: any[];
}

export interface QuestionModel {
  question_number: number;
  question: string;
}
