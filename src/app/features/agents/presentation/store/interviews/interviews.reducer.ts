// src/app/features/agents/presentation/store/interviews.reducer.ts

import { createReducer, on } from '@ngrx/store';
import { InterviewsActions } from './interviews.actions';
import { initialInterviewsState } from './interviews.state';

export const interviewsReducer = createReducer(
  initialInterviewsState,
  
  // Load Interviews
  on(InterviewsActions.loadInterviews, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(InterviewsActions.loadInterviewsSuccess, (state, { response }) => ({
    ...state,
    interviews: response.results,
    totalCount: response.totalCount,
    pagesCount: response.pagesCount,
    currentPage: response.currentPage,
    currentPageSize: response.currentPageSize,
    loading: false,
    error: null
  })),
  
  on(InterviewsActions.loadInterviewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Single Interview
  on(InterviewsActions.loadInterview, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(InterviewsActions.loadInterviewSuccess, (state, { interview }) => ({
    ...state,
    selectedInterview: interview,
    loading: false,
    error: null
  })),
  
  on(InterviewsActions.loadInterviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Interview Status
  on(InterviewsActions.updateInterviewStatus, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(InterviewsActions.updateInterviewStatusSuccess, (state, { interview }) => ({
    ...state,
    interviews: state.interviews.map(i => 
      i.id === interview.id ? interview : i
    ),
    selectedInterview: state.selectedInterview?.id === interview.id ? interview : state.selectedInterview,
    loading: false,
    error: null
  })),
  
  on(InterviewsActions.updateInterviewStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Interview
  on(InterviewsActions.deleteInterview, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(InterviewsActions.deleteInterviewSuccess, (state, { id }) => ({
    ...state,
    interviews: state.interviews.filter(i => i.id !== id),
    selectedInterview: state.selectedInterview?.id === id ? null : state.selectedInterview,
    loading: false,
    error: null
  })),
  
  on(InterviewsActions.deleteInterviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Clear and Set Selected Interview
  on(InterviewsActions.clearSelectedInterview, (state) => ({
    ...state,
    selectedInterview: null
  })),
  
  on(InterviewsActions.setSelectedInterview, (state, { interview }) => ({
    ...state,
    selectedInterview: interview
  }))
);