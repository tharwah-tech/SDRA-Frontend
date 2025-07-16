import { Observable } from 'rxjs';
import { RagConversationEntity } from '../entities/rag-conversation.entity';
import { RagConversationMessageEntity } from '../entities/rag-conversation.entity';
import { RagDocumentEntity } from '../entities/rag-document.enttity';
import { RagConversationSummaryEntity } from '../entities/rag-conversation-summary.entity';
import { PaginatedEntity } from '../../../../core/entities/paginated.entity';

export interface RagRepository {
  getRagDocuments(
    agentId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedEntity<RagDocumentEntity>>;
  uploadRagDocument(agentId: string, file: File): Observable<RagDocumentEntity>;
  getRagConversationsSummaries(
    agentId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedEntity<RagConversationSummaryEntity>>;
  getRagConversation(id: string): Observable<RagConversationEntity>;
  startRagConversation(agentId: string): Observable<RagConversationEntity>;
  sendRagTextMessage(
    conversationId: string,
    textMessage: string
  ): Observable<RagConversationMessageEntity>;
  sendRagAudioMessage(
    conversationId: string,
    audioMessage: string
  ): Observable<RagConversationMessageEntity>;
}
