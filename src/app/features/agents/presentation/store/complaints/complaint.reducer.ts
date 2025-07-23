import { createReducer, on } from '@ngrx/store';
import { ComplaintsActions } from './complaint.actions';
import { initialComplaintState } from './complaint.state';

export const complaintReducer = createReducer(
  initialComplaintState,
  //** Complaint Tickets */
  on(
    ComplaintsActions.loadComplaintTicketsSummaries,
    (state, { agentId, pageNumber, pageSize }) => ({
      ...state,
      loading: true,
      complaintTicketLoading: true,
      error: null,
    })
  ),
  on(
    ComplaintsActions.loadComplaintTicketsSummariesSuccess,
    (state, { paginatedComplaintTickets }) => ({
      ...state,
      loading: false,
      complaintTicketLoading: false,
      complaintTickets: paginatedComplaintTickets.items,
      complaintTicketsPagination: {
        totalCount: paginatedComplaintTickets.totalCount,
        pageNumber: paginatedComplaintTickets.pageNumber,
        pageSize: paginatedComplaintTickets.pageSize,
        totalPages: paginatedComplaintTickets.totalPages,
        hasNextPage: paginatedComplaintTickets.hasNextPage,
        hasPreviousPage: paginatedComplaintTickets.hasPreviousPage,
      },
    })
  ),
  on(
    ComplaintsActions.loadComplaintTicketsSummariesFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      complaintTicketLoading: false,
      error,
    })
  ),
  on(
    ComplaintsActions.loadComplaintTicketDetails,
    (state, { agentId, complaintTicketId }) => ({
      ...state,
      loading: true,
      complaintTicketLoading: true,
      selectedComplaintTicketId: complaintTicketId,
      error: null,
    })
  ),
  on(
    ComplaintsActions.loadComplaintTicketDetailsSuccess,
    (state, { complaintTicket }) => ({
      ...state,
      loading: false,
      complaintTicketLoading: false,
      selectedComplaintTicket: complaintTicket,
    })
  ),
  on(
    ComplaintsActions.loadComplaintTicketDetailsFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      complaintTicketLoading: false,
      error,
    })
  ),
  on(
    ComplaintsActions.updateComplaintTicket,
    (state, { agentId, complaintTicket }) => ({
      ...state,
      selectedComplaintTicketId: complaintTicket.id,
      loading: true,
      complaintTicketLoading: true,
      error: null,
    })
  ),
  on(
    ComplaintsActions.updateComplaintTicketSuccess,
    (state, { complaintTicket }) => ({
      ...state,
      loading: false,
      complaintTicketLoading: false,
      selectedComplaintTicket: complaintTicket,
    })
  ),
  on(ComplaintsActions.updateComplaintTicketFailure, (state, { error }) => ({
    ...state,
    loading: false,
    complaintTicketLoading: false,
    error,
  })),
  on(
    ComplaintsActions.deleteComplaintTicket,
    (state, { agentId, complaintTicketId }) => ({
      ...state,
      selectedComplaintTicketId: complaintTicketId,
      loading: true,
      complaintTicketLoading: true,
      error: null,
    })
  ),
  on(
    ComplaintsActions.deleteComplaintTicketSuccess,
    (state, { complaintTicketId }) => ({
      ...state,
      loading: false,
      complaintTicketLoading: false,
      complaintTickets: state.complaintTickets.filter(
        (ticket) => ticket.id !== complaintTicketId
      ),
      selectedComplaintTicketId: null,
    })
  ),
  on(ComplaintsActions.deleteComplaintTicketFailure, (state, { error }) => ({
    ...state,
    loading: false,
    complaintTicketLoading: false,
    error,
  })),

  //** Complaint Categories */
  on(
    ComplaintsActions.loadComplaintCategories,
    (state, { agentId, pageNumber, pageSize }) => ({
      ...state,
      loading: true,
      complaintCategoryLoading: true,
      error: null,
    })
  ),
  on(
    ComplaintsActions.loadComplaintCategoriesSuccess,
    (state, { paginatedComplaintCategories }) => ({
      ...state,
      loading: false,
      complaintCategoryLoading: false,
      complaintCategories: paginatedComplaintCategories.items,
      complaintCategoriesPagination: {
        totalCount: paginatedComplaintCategories.totalCount,
        pageNumber: paginatedComplaintCategories.pageNumber,
        pageSize: paginatedComplaintCategories.pageSize,
        totalPages: paginatedComplaintCategories.totalPages,
        hasNextPage: paginatedComplaintCategories.hasNextPage,
        hasPreviousPage: paginatedComplaintCategories.hasPreviousPage,
      },
    })
  ),
  on(ComplaintsActions.loadComplaintCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    complaintCategoryLoading: false,
    error,
  })),
  on(
    ComplaintsActions.loadComplaintCategory,
    (state, { agentId, complaintCategoryId }) => ({
      ...state,
      selectedComplaintCategoryId: complaintCategoryId,
      loading: true,
      complaintCategoryLoading: true,
      error: null,
    })
  ),
  on(
    ComplaintsActions.loadComplaintCategorySuccess,
    (state, { complaintCategory }) => ({
      ...state,
      loading: false,
      complaintCategoryLoading: false,
      selectedComplaintCategory: complaintCategory,
    })
  ),
  on(ComplaintsActions.loadComplaintCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    complaintCategoryLoading: false,
    error,
  })),
  on(
    ComplaintsActions.createComplaintCategory,
    (state, { agentId, complaintCategory }) => ({
      ...state,
      loading: true,
      complaintCategoryLoading: true,
      selectedComplaintCategory: complaintCategory,
      error: null,
    })
  ),
  on(
    ComplaintsActions.createComplaintCategorySuccess,
    (state, { complaintCategory }) => ({
      ...state,
      loading: false,
      complaintCategoryLoading: false,
      selectedComplaintCategory: complaintCategory,
      complaintCategories: [...state.complaintCategories, complaintCategory],
    })
  ),
  on(ComplaintsActions.createComplaintCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    complaintCategoryLoading: false,
    error,
  })),
  on(
    ComplaintsActions.updateComplaintCategory,
    (state, { agentId, complaintCategory }) => ({
      ...state,
      loading: true,
      complaintCategoryLoading: true,
      selectedComplaintCategoryId: complaintCategory.id,
      selectedComplaintCategory: complaintCategory,
      error: null,
    })
  ),
  on(
    ComplaintsActions.updateComplaintCategorySuccess,
    (state, { complaintCategory }) => ({
      ...state,
      loading: false,
      complaintCategoryLoading: false,
      selectedComplaintCategory: complaintCategory,
      complaintCategories: state.complaintCategories.map((category) =>
        category.id === complaintCategory.id ? complaintCategory : category
      ),
    })
  ),
  on(ComplaintsActions.updateComplaintCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    complaintCategoryLoading: false,
    error,
  })),
  on(
    ComplaintsActions.deleteComplaintCategory,
    (state, { agentId, complaintCategoryId }) => ({
      ...state,
      selectedComplaintCategoryId: complaintCategoryId,
      loading: true,
      complaintCategoryLoading: true,
      error: null,
    })
  ),
  on(
    ComplaintsActions.deleteComplaintCategorySuccess,
    (state, { complaintCategoryId }) => ({
      ...state,
      loading: false,
      complaintCategoryLoading: false,
      complaintCategories: state.complaintCategories.filter(
        (category) => category.id !== complaintCategoryId
      ),
      selectedComplaintCategoryId: null,
    })
  ),
  on(ComplaintsActions.deleteComplaintCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    complaintCategoryLoading: false,
    error,
  })),

  //** Complaint Conversations */
  on(
    ComplaintsActions.loadComplaintConversationsSummaries,
    (state, { agentId, pageNumber, pageSize }) => ({
      ...state,
      loading: true,
      complaintConversationLoading: true,
      error: null,
    })
  ),
  on(
    ComplaintsActions.loadComplaintConversationsSummariesSuccess,
    (state, { paginatedComplaintConversations }) => ({
      ...state,
      loading: false,
      complaintConversationLoading: false,
      complaintConversations: paginatedComplaintConversations.items,
      complaintConversationsPagination: {
        totalCount: paginatedComplaintConversations.totalCount,
        pageNumber: paginatedComplaintConversations.pageNumber,
        pageSize: paginatedComplaintConversations.pageSize,
        totalPages: paginatedComplaintConversations.totalPages,
        hasNextPage: paginatedComplaintConversations.hasNextPage,
        hasPreviousPage: paginatedComplaintConversations.hasPreviousPage,
      },
    })
  ),
  on(
    ComplaintsActions.loadComplaintConversationsSummariesFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      complaintConversationLoading: false,
      error,
    })
  ),
  on(
    ComplaintsActions.loadComplaintConversationDetails,
    (state, { agentId, complaintConversationId }) => ({
      ...state,
      selectedComplaintConversationId: complaintConversationId,
      loading: true,
      complaintConversationLoading: true,
      error: null,
    })
  ),
  on(
    ComplaintsActions.loadComplaintConversationDetailsSuccess,
    (state, { complaintConversation }) => ({
      ...state,
      loading: false,
      complaintConversationLoading: false,
      selectedComplaintConversation: complaintConversation,
    })
  ),
  on(
    ComplaintsActions.loadComplaintConversationDetailsFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      complaintConversationLoading: false,
      error,
    })
  ),
  on(ComplaintsActions.startComplaintConversation, (state, { agentId }) => ({
    ...state,
    loading: true,
    complaintConversationLoading: true,
    error: null,
  })),
  on(
    ComplaintsActions.startComplaintConversationSuccess,
    (state, { complaintConversation }) => ({
      ...state,
      loading: false,
      complaintConversationLoading: false,
      complaintConversation,
    })
  ),
  on(
    ComplaintsActions.startComplaintConversationFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      complaintConversationLoading: false,
      error,
    })
  ),
  on(
    ComplaintsActions.sendComplaintTextMessage,
    (state, { agentId, conversationId, textMessage }) => ({
      ...state,
      loading: true,
      complaintConversationLoading: true,
      selectedComplaintConversation: {
        ...state.selectedComplaintConversation!,
        messages: [...state.selectedComplaintConversation?.messages!, {
          message_type: 'user',
          content: textMessage,
          message_date: new Date(),
          audio_content: '',
        }],
      },
      error: null,
    })
  ),
  on(
    ComplaintsActions.sendComplaintTextMessageSuccess,
    (state, { message }) => ({
      ...state,
      loading: false,
      complaintConversationLoading: false,
      selectedComplaintConversation: {
        ...state.selectedComplaintConversation!,
        messages: [...state.selectedComplaintConversation?.messages!, message],
      },
    })
  ),
  on(ComplaintsActions.sendComplaintTextMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    complaintConversationLoading: false,
    selectedComplaintConversation: {
      ...state.selectedComplaintConversation!,
      messages: [...state.selectedComplaintConversation?.messages!, {
        message_type: 'user',
        content: error.message || 'Error sending message try again',
        message_date: new Date(),
        audio_content: '',
      }],
    },
    error,
  })),
  on(
    ComplaintsActions.sendComplaintAudioMessage,
    (state, { agentId, conversationId, audioMessage }) => ({
      ...state,
      loading: true,
      complaintConversationLoading: true,
      selectedComplaintConversation: {
        ...state.selectedComplaintConversation!,
        messages: [...state.selectedComplaintConversation?.messages!, {
          message_type: 'user',
          content: '',
          message_date: new Date(),
          audio_content: URL.createObjectURL(audioMessage),
        }],
      },
      error: null,
    })
  ),
  on(
    ComplaintsActions.sendComplaintAudioMessageSuccess,
    (state, { message }) => ({
      ...state,
      loading: false,
      complaintConversationLoading: false,
      selectedComplaintConversation: {
        ...state.selectedComplaintConversation!,
        messages: [...state.selectedComplaintConversation?.messages!, message],
      },
    })
  ),
  on(
    ComplaintsActions.sendComplaintAudioMessageFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      complaintConversationLoading: false,
      selectedComplaintConversation: {
        ...state.selectedComplaintConversation!,
        messages: [...state.selectedComplaintConversation?.messages!, {
          message_type: 'user',
          content: error.message || 'Error sending message try again',
          message_date: new Date(),
          audio_content: '',
        }],
      },
      error,
    })
  )
);
