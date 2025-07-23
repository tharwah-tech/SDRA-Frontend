import { createFeatureSelector } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { COMPLAINT_FEATURE_KEY, ComplaintState } from './complaint.state';

export const selectComplaintsState = createFeatureSelector<ComplaintState>(
  COMPLAINT_FEATURE_KEY
);

export const selectComplaintTickets = createSelector(
  selectComplaintsState,
  (state) => state.complaintTickets
);

export const selectComplaintTicketsPagination = createSelector(
  selectComplaintsState,
  (state) => state.complaintTicketsPagination
);

export const selectComplaintCategories = createSelector(
  selectComplaintsState,
  (state) => state.complaintCategories
);

export const selectComplaintCategoriesPagination = createSelector(
  selectComplaintsState,
  (state) => state.complaintCategoriesPagination
);

export const selectComplaintConversations = createSelector(
  selectComplaintsState,
  (state) => state.complaintConversations
);
export const selectComplaintConversationsPagination = createSelector(
  selectComplaintsState,
  (state) => state.complaintConversationsPagination
);
export const selectSelectedComplaintTicket = createSelector(
  selectComplaintsState,
  (state) => state.selectedComplaintTicket
);
export const selectSelectedComplaintTicketId = createSelector(
  selectComplaintsState,
  (state) => state.selectedComplaintTicketId
);
export const selectSelectedComplaintCategory = createSelector(
  selectComplaintsState,
  (state) => state.selectedComplaintCategory
);
export const selectSelectedComplaintCategoryId = createSelector(
  selectComplaintsState,
  (state) => state.selectedComplaintCategoryId
);
export const selectSelectedComplaintConversation = createSelector(
  selectComplaintsState,
  (state) => state.selectedComplaintConversation
);
export const selectSelectedComplaintConversationId = createSelector(
  selectComplaintsState,
  (state) => state.selectedComplaintConversationId
);
export const selectComplaintTicketLoading = createSelector(
  selectComplaintsState,
  (state) => state.complaintTicketLoading
);
export const selectComplaintCategoryLoading = createSelector(
  selectComplaintsState,
  (state) => state.complaintCategoryLoading
);
export const selectComplaintConversationLoading = createSelector(
  selectComplaintsState,
  (state) => state.complaintConversationLoading
);
export const selectComplaintLoading = createSelector(
  selectComplaintsState,
  (state) => state.loading
);
export const selectComplaintError = createSelector(
  selectComplaintsState,
  (state) => state.error
);
