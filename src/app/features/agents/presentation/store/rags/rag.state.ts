import { ApiError } from "../../../../../core/models/api-error.model";
import { RagConversationSummaryEntity } from "../../../domain/entities/rag-conversation-summary.entity";
import { RagConversationEntity } from "../../../domain/entities/rag-conversation.entity";
import { RagDocumentEntity } from "../../../domain/entities/rag-document.enttity";
import { PaginationMetadata } from "../../../../../core/entities/paginator.entity";

export const RAG_FEATURE_KEY = 'rags';

// Custom pagination metadata without duplicating the items


export interface RagState {
  documentsList: RagDocumentEntity[];
  documentsPagination: PaginationMetadata | null;
  conversationSummaryList: RagConversationSummaryEntity[];
  selectedConversation: RagConversationEntity | null;
  selectedConversationId: string | null;
  loading: boolean;
  error: ApiError | null;
}

export const initialRagState: RagState = {
  documentsList: [],
  documentsPagination: null,
  conversationSummaryList: [],
  selectedConversation: null,
  selectedConversationId: null,
  loading: false,
  error: null,
};
