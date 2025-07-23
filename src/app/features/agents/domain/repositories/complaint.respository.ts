import { Observable } from 'rxjs';
import { PaginatedEntity } from '../../../../core/entities/paginated.entity';
import {
  ComplaintTicketEntity,
  ComplaintTicketSummaryEntity,
} from '../entities/complaint-ticket.entity';
import { ComplaintCategoryEntity } from '../entities/compaint-category.entity';
import { ConversationEntity, ConversationMessageEntity } from '../entities/conversation.entity';
import { ConversationSummaryEntity } from '../entities/conversation-summary.entity';

export interface ComplaintRepository {
  getComplaintTickets(
    agentId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedEntity<ComplaintTicketSummaryEntity>>;
  getComplaintTicket(id: string): Observable<ComplaintTicketEntity>;
  updateComplaintTicket(
    id: string,
    complaintTicket: ComplaintTicketEntity
  ): Observable<ComplaintTicketEntity>;
  deleteComplaintTicket(id: string): Observable<void>;
  getComplaintCategories(
    agentId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedEntity<ComplaintCategoryEntity>>;
  createComplaintCategory(
    agentId: string,
    complaintCategory: ComplaintCategoryEntity
  ): Observable<ComplaintCategoryEntity>;
  updateComplaintCategory(
    agentId: string,
    id: string,
    complaintCategory: ComplaintCategoryEntity
  ): Observable<ComplaintCategoryEntity>;
  deleteComplaintCategory(agentId: string, id: string): Observable<void>;
  getComplaintConversationsSummaries(
    agentId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedEntity<ConversationSummaryEntity>>;
  getComplaintConversation(id: string): Observable<ConversationEntity>;
  startComplaintConversation(agentId: string): Observable<ConversationSummaryEntity>;
  sendComplaintTextMessage(
    agentId: string,
    conversationId: string,
    textMessage: string
  ): Observable<ConversationMessageEntity>;
  sendComplaintAudioMessage(
    agentId: string,
    conversationId: string,
    audioMessage: File
  ): Observable<ConversationMessageEntity>;
}
