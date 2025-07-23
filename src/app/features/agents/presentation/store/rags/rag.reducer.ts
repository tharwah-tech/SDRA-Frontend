
import { createReducer, on } from '@ngrx/store';
import { RagsActions } from './rag.actions';
import { initialRagState } from './rag.state';
import { PaginationMetadata } from '../../../../../core/entities/paginator.entity';

export const ragReducer = createReducer(
  initialRagState,
  // Load Rag Documents
  on(RagsActions.loadRagDocuments, (state, { agentId, pageNumber, pageSize }) => ({
    ...state,
    loading: true,
    isLoadingDocuments: true,
    error: null,
  })),
  on(RagsActions.loadRagDocumentsSuccess, (state, { paginatedDocuments }) => {
    // Extract pagination metadata without duplicating the items
    const paginationMetadata: PaginationMetadata = {
      totalCount: paginatedDocuments.totalCount,
      pageNumber: paginatedDocuments.pageNumber,
      pageSize: paginatedDocuments.pageSize,
      totalPages: paginatedDocuments.totalPages,
      hasNextPage: paginatedDocuments.hasNextPage,
      hasPreviousPage: paginatedDocuments.hasPreviousPage,
    };

    return {
      ...state,
      documentsList: paginatedDocuments.items,
      documentsPagination: paginationMetadata,
      loading: false,
      isLoadingDocuments: false,
      error: null,
    };
  }),
  on(RagsActions.loadRagDocumentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoadingDocuments: false,
    error,
  })),

  // Upload Rag Document
  on(RagsActions.uploadRagDocument, (state, { agentId, file }) => ({
    ...state,
    documentUploading: true,
    error: null,
  })),
  on(RagsActions.uploadRagDocumentSuccess, (state, { document }) => ({
    ...state,
    documentUploading: false,
    error: null,
  })),
  on(RagsActions.uploadRagDocumentFailure, (state, { error }) => ({
    ...state,
    documentUploading: false,
    error,
  })),

  // Load Rag Conversations Summaries
  on(RagsActions.loadRagConversationsSummaries, (state, { agentId, pageNumber, pageSize }) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(RagsActions.loadRagConversationsSummariesSuccess, (state, { paginatedConversationSummaryList }) => {
    // Extract pagination metadata for conversations
    const conversationsPaginationMetadata: PaginationMetadata = {
      totalCount: paginatedConversationSummaryList.totalCount,
      pageNumber: paginatedConversationSummaryList.pageNumber,
      pageSize: paginatedConversationSummaryList.pageSize,
      totalPages: paginatedConversationSummaryList.totalPages,
      hasNextPage: paginatedConversationSummaryList.hasNextPage,
      hasPreviousPage: paginatedConversationSummaryList.hasPreviousPage,
    };

    return {
      ...state,
      conversationSummaryList: paginatedConversationSummaryList.items,
      conversationsPagination: conversationsPaginationMetadata,
      loading: false,
      error: null,
    };
  }),
  on(RagsActions.loadRagConversationsSummariesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Rag Conversation
  on(RagsActions.loadRagConversation, (state, { id }) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(RagsActions.loadRagConversationSuccess, (state, { conversation }) => ({
    ...state,
    selectedConversation:conversation,
    loading: false,
    error: null,
  })),
  on(RagsActions.loadRagConversationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //start rag conversation
  on(RagsActions.startRagConversation, (state, { agentId }) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(RagsActions.startRagConversationSuccess, (state, { conversation }) => ({
    ...state,
    conversationSummaryList: [...state.conversationSummaryList, conversation],
    loading: false,
    error: null,
  })),
  on(RagsActions.startRagConversationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Send Rag text message
  on(RagsActions.sendRagTextMessage, (state, { textMessage }) => ({
    ...state,
    selectedConversation: {
      ...state.selectedConversation!,
      messages: [...state.selectedConversation?.messages!, {
        message_type: 'user',
        content: textMessage,
        message_date: new Date(),
        audio_content: '',
      }],
    },
    messageSending: true,
    error: null,
  })),
  on(RagsActions.sendRagTextMessageSuccess, (state, { message }) => ({
    ...state,
    selectedConversation: {
      ...state.selectedConversation!,
      messages: [...state.selectedConversation?.messages!, message],
    },
    messageSending: false,
    error: null,
  })),
  on(RagsActions.sendRagTextMessageFailure, (state, { error }) => ({
    ...state,
    selectedConversation: {
      ...state.selectedConversation!,
      messages: [...state.selectedConversation?.messages!, {
        message_type: 'user',
        content: error.message || 'Error sending message try again',
        message_date: new Date(),
        audio_content: '',
      }],
    },
    messageSending: false,
    error,
  })),

  // Send Rag audio message
  on(RagsActions.sendRagAudioMessage, (state, { audioMessage }) => ({
    ...state,
    selectedConversation: {
      ...state.selectedConversation!,
      messages: [...state.selectedConversation?.messages!, {
        message_type: 'user',
        content: '',
        message_date: new Date(),
        audio_content: URL.createObjectURL(audioMessage),
      }],
    },
    messageSending: true,
    error: null,
  })),
  on(RagsActions.sendRagAudioMessageSuccess, (state, { message }) => ({
    ...state,
    selectedConversation: {
      ...state.selectedConversation!,
      messages: [...state.selectedConversation?.messages!, message],
    },
    messageSending: false,
    error: null,
  })),
  on(RagsActions.sendRagAudioMessageFailure, (state, { error }) => ({
    ...state,
    messageSending: false,
    selectedConversation: {
      ...state.selectedConversation!,
      messages: [...state.selectedConversation?.messages!, {
        message_type: 'user',
        content: error.message || 'Error sending message try again',
        message_date: new Date(),
        audio_content: '',
      }],
    },
    error,
  })),
);
