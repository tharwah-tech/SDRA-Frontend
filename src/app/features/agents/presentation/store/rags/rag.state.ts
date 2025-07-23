
import { ApiError } from "../../../../../core/models/api-error.model";
import { ConversationSummaryEntity } from "../../../domain/entities/conversation-summary.entity";
import { ConversationEntity } from "../../../domain/entities/conversation.entity";
import { DocumentEntity } from "../../../domain/entities/document.enttity";
import { PaginationMetadata } from "../../../../../core/entities/paginator.entity";

export const RAG_FEATURE_KEY = 'rags';

export interface RagState {
  documentsList: DocumentEntity[];
  documentsPagination: PaginationMetadata | null;
  conversationSummaryList: ConversationSummaryEntity[];
  conversationsPagination: PaginationMetadata | null;
  selectedConversation: ConversationEntity | null;
  selectedConversationId: string | null;
  documentUploading: boolean;
  messageSending: boolean;
  loading: boolean;
  error: ApiError | null;
}

export const initialRagState: RagState = {
  documentsList: [],
  documentsPagination: null,
  conversationSummaryList: [],
  selectedConversation: null,
  selectedConversationId: 'dummy-conversation-123',
  conversationsPagination: null,
  documentUploading: false,
  messageSending: false,
  loading: false,
  error: null,
};
