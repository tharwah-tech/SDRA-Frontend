// src/app/features/agents/presentation/store/interviews.state.ts

import { ApiError } from "../../../../../core/models/api-error.model";
import { InterviewDetailsEntity } from "../../../domain/entities/interview-details.entity";
import { InterviewEntity } from "../../../domain/entities/interview.entity";


export const INTERVIEWS_FEATURE_KEY = 'interviews';

export interface InterviewsState {
  interviews: InterviewEntity[];
  selectedInterview: InterviewDetailsEntity | null;
  loading: boolean;
  error: ApiError | null;
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
