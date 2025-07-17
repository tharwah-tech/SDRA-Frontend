// src/app/features/agents/presentation/store/rags/rag.selectors.ts

import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RAG_FEATURE_KEY, RagState } from "./rag.state";

export const selectRagState = createFeatureSelector<RagState>(
  RAG_FEATURE_KEY
);

export const selectRagDocumentsList = createSelector(
  selectRagState,
  (state) => state.documentsList
);

export const selectRagDocumentsPagination = createSelector(
  selectRagState,
  (state) => state.documentsPagination
);

export const selectRagConversationSummaryList = createSelector(
  selectRagState,
  (state) => state.conversationSummaryList
);

export const selectRagConversationsPagination = createSelector(
  selectRagState,
  (state) => state.conversationsPagination
);

export const selectRagSelectedConversation = createSelector(
  selectRagState,
  (state) => state.selectedConversation
);

export const selectRagSelectedConversationId = createSelector(
  selectRagState,
  (state) => state.selectedConversationId
);

export const selectRagLoading = createSelector(
  selectRagState,
  (state) => state.loading
);

export const selectRagError = createSelector(
  selectRagState,
  (state) => state.error
);