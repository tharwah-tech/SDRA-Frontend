// src/app/features/agents/presentation/store/interviews.state.ts

import { InterviewEntity } from "../../../domain/entities/interview.entity";


export const INTERVIEWS_FEATURE_KEY = 'interviews';

export interface InterviewsState {
  interviews: InterviewEntity[];
  selectedInterview: InterviewEntity | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  pagesCount: number;
  currentPage: number;
  currentPageSize: number;
}

export const initialInterviewsState: InterviewsState = {
  interviews: [],
  selectedInterview: null,
  loading: false,
  error: null,
  totalCount: 0,
  pagesCount: 0,
  currentPage: 1,
  currentPageSize: 10
};