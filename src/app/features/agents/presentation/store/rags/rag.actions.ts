import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { RAG_FEATURE_KEY } from './rag.state';
import { ApiError } from '../../../../../core/models/api-error.model';
import { ConversationSummaryEntity } from '../../../domain/entities/conversation-summary.entity';
import { DocumentEntity } from '../../../domain/entities/document.enttity';
import {
  ConversationEntity,
  ConversationMessageEntity,
} from '../../../domain/entities/conversation.entity';
import { PaginatedEntity } from '../../../../../core/entities/paginated.entity';

export const RagsActions = createActionGroup({
  source: RAG_FEATURE_KEY,
  events: {
    'Load Rag Documents': props<{
      agentId: string;
      pageNumber: number;
      pageSize: number;
    }>(),
    'Load Rag Documents Success': props<{
      paginatedDocuments: PaginatedEntity<DocumentEntity>;
    }>(),
    'Load Rag Documents Failure': props<{ error: ApiError }>(),

    'Upload Rag Document': props<{ agentId: string; file: File }>(),
    'Upload Rag Document Success': props<{ agentId: string; document: DocumentEntity }>(),
    'Upload Rag Document Failure': props<{ error: ApiError }>(),

    'Load Rag Conversations Summaries': props<{
      agentId: string;
      pageNumber: number;
      pageSize: number;
    }>(),
    'Load Rag Conversations Summaries Success': props<{
      paginatedConversationSummaryList: PaginatedEntity<ConversationSummaryEntity>;
    }>(),
    'Load Rag Conversations Summaries Failure': props<{ error: ApiError }>(),

    'Load Rag Conversation': props<{ id: string }>(),
    'Load Rag Conversation Success': props<{
      conversation: ConversationEntity;
    }>(),
    'Load Rag Conversation Failure': props<{ error: ApiError }>(),

    'Start Rag Conversation': props<{
      agentId: string;
    }>(),
    'Start Rag Conversation Success': props<{
      conversation: ConversationSummaryEntity;
    }>(),
    'Start Rag Conversation Failure': props<{ error: ApiError }>(),

    'Send Rag text message': props<{ agentId: string; conversationId: string; textMessage: string }>(),
    'Send Rag text message Success': props<{
      message: ConversationMessageEntity;
    }>(),
    'Send Rag text message Failure': props<{ error: ApiError }>(),

    'Send Rag audio message': props<{ agentId: string; conversationId: string; audioMessage: File }>(),
    'Send Rag audio message Success': props<{
      message: ConversationMessageEntity;
    }>(),
    'Send Rag audio message Failure': props<{ error: ApiError }>(),
  },
});
