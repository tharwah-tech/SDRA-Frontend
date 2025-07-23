import { PaginationMetadata } from "../../../../../core/entities/paginator.entity";
import { ConversationEntity } from "../../../domain/entities/conversation.entity";
import { ComplaintTicketEntity, ComplaintTicketSummaryEntity } from "../../../domain/entities/complaint-ticket.entity";
import { ComplaintCategoryEntity } from "../../../domain/entities/compaint-category.entity";
import { ApiError } from "../../../../../core/models/api-error.model";
import { ConversationSummaryEntity } from "../../../domain/entities/conversation-summary.entity";

export const COMPLAINT_FEATURE_KEY = 'complaint';
export interface ComplaintState {
  complaintTickets: ComplaintTicketSummaryEntity[];
  complaintTicketsPagination: PaginationMetadata;
  complaintCategories: ComplaintCategoryEntity[];
  complaintCategoriesPagination: PaginationMetadata;
  complaintConversations: ConversationSummaryEntity[];
  complaintConversationsPagination: PaginationMetadata;
  selectedComplaintCategoryId: string | null;
  selectedComplaintTicket: ComplaintTicketEntity | null;
  selectedComplaintTicketId: string | null;
  selectedComplaintCategory: ComplaintCategoryEntity | null;
  selectedComplaintConversationId: string | null;
  selectedComplaintConversation: ConversationEntity | null;
  complaintTicketLoading: boolean;
  complaintCategoryLoading: boolean;
  complaintConversationLoading: boolean;
  loading: boolean;
  error: ApiError | null;
}
export const initialComplaintState: ComplaintState = {
  complaintTickets: [],
  complaintTicketsPagination: {
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  complaintCategories: [],
  complaintCategoriesPagination: {
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  complaintConversations: [],
  complaintConversationsPagination: {
    totalCount: 0,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  selectedComplaintCategoryId: null,
  selectedComplaintTicket: null,
  selectedComplaintTicketId: null,
  selectedComplaintCategory: null,
  selectedComplaintConversationId: null,
  selectedComplaintConversation: null,
  complaintTicketLoading: false,
  complaintCategoryLoading: false,
  complaintConversationLoading: false,
  loading: false,
  error: null,
};
