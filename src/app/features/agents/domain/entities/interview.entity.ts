
export interface InterviewEntity {
  id: string;
  candidateName: string;
  jobTitle: string;
  creationDate: Date;
  status: InterviewStatus;
}

export enum InterviewStatus {
  SCHEDULED = 'scheduled',
  PROCESSED = 'processed',
  IN_PROGRESS = 'in_progress',
  TAKEN = 'taken'
}

export interface InterviewsResponse {
  totalCount: number;
  pagesCount: number;
  currentPage: number;
  currentPageSize: number;
  results: InterviewEntity[];
}