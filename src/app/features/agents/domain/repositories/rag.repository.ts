import { Observable } from 'rxjs';
import { ConversationEntity } from '../entities/conversation.entity';
import { ConversationMessageEntity } from '../entities/conversation.entity';
import { DocumentEntity } from '../entities/document.enttity';
import { ConversationSummaryEntity } from '../entities/conversation-summary.entity';
import { PaginatedEntity } from '../../../../core/entities/paginated.entity';

export interface RagRepository {
  getRagDocuments(
    agentId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedEntity<DocumentEntity>>;
  uploadRagDocument(agentId: string, file: File): Observable<DocumentEntity>;
  getRagConversationsSummaries(
    agentId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedEntity<ConversationSummaryEntity>>;
  getRagConversation(id: string): Observable<ConversationEntity>;
  startRagConversation(agentId: string): Observable<ConversationSummaryEntity>;
  sendRagTextMessage(
    agentId: string,
    conversationId: string,
    textMessage: string
  ): Observable<ConversationMessageEntity>;
  sendRagAudioMessage(
    agentId: string,
    conversationId: string,
    audioMessage: File
  ): Observable<ConversationMessageEntity>;
}
