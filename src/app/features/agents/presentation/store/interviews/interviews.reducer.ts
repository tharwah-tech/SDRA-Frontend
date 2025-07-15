// src/app/features/agents/presentation/store/interviews.reducer.ts

import { createReducer, on } from '@ngrx/store';
import { InterviewsActions } from './interviews.actions';
import { initialInterviewsState } from './interviews.state';
import { InterviewEntity } from '../../../domain/entities/interview.entity';

export const interviewsReducer = createReducer(
  initialInterviewsState,

  // Load Interviews
  on(InterviewsActions.loadInterviews, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(InterviewsActions.loadInterviewsSuccess, (state, { response }) => ({
    ...state,
    interviews: response.results,
    totalCount: response.totalCount,
    pagesCount: response.pagesCount,
    currentPage: response.currentPage,
    currentPageSize: response.currentPageSize,
    loading: false,
    error: null,
  })),

  on(InterviewsActions.loadInterviewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Interview
  on(InterviewsActions.loadInterview, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(InterviewsActions.loadInterviewSuccess, (state, { interview }) => ({
    ...state,
    selectedInterview: interview,
    loading: false,
    error: null,
  })),

  on(InterviewsActions.loadInterviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Interview Status
  on(InterviewsActions.updateInterviewStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    InterviewsActions.updateInterviewStatusSuccess,
    (state, { interview }) => ({
      ...state,
      interviews: state.interviews.map((i) =>
        i.id === interview.id
          ? ({
              id: interview.id,
              candidateName: interview.candidate_info.full_name,
              jobTitle: interview.job_info.title,
              creationDate: interview.creation_date,
              status: interview.status,
            } as InterviewEntity)
          : i
      ),
      selectedInterview: interview,
      loading: false,
      error: null,
    })
  ),

  on(InterviewsActions.updateInterviewStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Interview
  on(InterviewsActions.deleteInterview, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(InterviewsActions.deleteInterviewSuccess, (state, { id }) => ({
    ...state,
    interviews: state.interviews.filter((i) => i.id !== id),
    selectedInterview: null,
    loading: false,
    error: null,
  })),

  on(InterviewsActions.deleteInterviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear and Set Selected Interview
  on(InterviewsActions.clearSelectedInterview, (state) => ({
    ...state,
    selectedInterview: null,
  })),

  on(InterviewsActions.setSelectedInterview, (state, { interview }) => ({
    ...state,
    selectedInterview: interview,
  })),

  on(InterviewsActions.shareInterview, (state, { interviewId }) => ({
    ...state,
    selectedInterviewToken: null,
    selectedInterviewLink: null,
    loading: true,
    error: null,
  })),
  on(InterviewsActions.shareInterviewSuccess, (state, { token }) => ({
    ...state,
    selectedInterviewToken: token,
    loading: false,
    error: null,
  })),
  on(InterviewsActions.shareInterviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(InterviewsActions.setInteviewToken, (state, { token }) => ({
    ...state,
    selectedInterviewToken: token,
    selectedInterviewLink: null,
  })),

  on(InterviewsActions.getInterviewLink, (state, { token }) => ({
    ...state,
    selectedInterviewToken: token,
    selectedInterviewLink: null,
    loading: true,
    error: null,
  })),
  on(InterviewsActions.getInterviewLinkSuccess, (state, { interviewLink }) => ({
    ...state,
    selectedInterviewLink: interviewLink,
    loading: false,
    error: null,
  })),
  on(InterviewsActions.shareInterviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(InterviewsActions.setInteviewLink, (state, { interviewLink }) => ({
    ...state,
    selectedInterviewLink: interviewLink,
  })),

  on(InterviewsActions.setError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
