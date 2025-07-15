import { createSelector, createFeatureSelector } from '@ngrx/store';
import { InterviewsState, INTERVIEWS_FEATURE_KEY } from './interviews.state';

export const selectInterviewsState = createFeatureSelector<InterviewsState>(
  INTERVIEWS_FEATURE_KEY
);

export const selectAllInterviews = createSelector(
  selectInterviewsState,
  (state: InterviewsState) => state.interviews
);

export const selectSelectedInterview = createSelector(
  selectInterviewsState,
  (state: InterviewsState) => state.selectedInterview
);

export const selectInterviewsLoading = createSelector(
  selectInterviewsState,
  (state: InterviewsState) => state.loading
);

export const selectInterviewsError = createSelector(
  selectInterviewsState,
  (state: InterviewsState) => state.error
);

export const selectInterviewsCount = createSelector(
  selectInterviewsState,
  (state: InterviewsState) => state.totalCount
);

export const selectInterviewsPagination = createSelector(
  selectInterviewsState,
  (state: InterviewsState) => ({
    totalCount: state.totalCount,
    pagesCount: state.pagesCount,
    currentPage: state.currentPage,
    currentPageSize: state.currentPageSize,
  })
);

export const selectInterviewById = (id: string) =>
  createSelector(selectAllInterviews, (interviews) =>
    interviews.find((interview) => interview.id === id)
  );

export const selectInterviewsByStatus = (status: string) =>
  createSelector(selectAllInterviews, (interviews) =>
    interviews.filter((interview) => interview.status === status)
  );

export const selectSelectedInterviewToken = createSelector(
  selectInterviewsState,
  (state: InterviewsState) => state.selectedInterviewToken
);

export const selectSelectedInterviewLink = createSelector(
  selectInterviewsState,
  (state: InterviewsState) => state.selectedInterviewLink
);
