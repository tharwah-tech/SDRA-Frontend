import { createActionGroup, props } from '@ngrx/store';

import { COMPLAINT_FEATURE_KEY } from './complaint.state';
import {
  ComplaintTicketEntity,
  ComplaintTicketSummaryEntity,
} from '../../../domain/entities/complaint-ticket.entity';
import { ApiError } from '../../../../../core/models/api-error.model';
import { ComplaintCategoryEntity } from '../../../domain/entities/compaint-category.entity';
import { ConversationSummaryEntity } from '../../../domain/entities/conversation-summary.entity';
import { PaginatedEntity } from '../../../../../core/entities/paginated.entity';
import {
  ConversationEntity,
  ConversationMessageEntity,
} from '../../../domain/entities/conversation.entity';

export const ComplaintsActions = createActionGroup({
  source: COMPLAINT_FEATURE_KEY,
  events: {
    //** Complaint Tickets
    // 1. Load Complaint Tickets Summaries
    // 2. Load Complaint Ticket details
    // 4. Update Complaint Ticket
    // 5. Delete Complaint Ticket
    // */
    'Load Complaint Tickets Summaries': props<{
      agentId: string;
      pageNumber: number;
      pageSize: number;
    }>(),
    'Load Complaint Tickets Summaries Success': props<{
      paginatedComplaintTickets: PaginatedEntity<ComplaintTicketSummaryEntity>;
    }>(),
    'Load Complaint Tickets Summaries Failure': props<{ error: ApiError }>(),
    'Load Complaint Ticket Details': props<{
      agentId: string;
      complaintTicketId: string;
    }>(),
    'Load Complaint Ticket Details Success': props<{
      complaintTicket: ComplaintTicketEntity;
    }>(),
    'Load Complaint Ticket Details Failure': props<{ error: ApiError }>(),
    'Update Complaint Ticket': props<{
      agentId: string;
      complaintTicket: ComplaintTicketEntity;
    }>(),
    'Update Complaint Ticket Success': props<{
      complaintTicket: ComplaintTicketEntity;
    }>(),
    'Update Complaint Ticket Failure': props<{ error: ApiError }>(),
    'Delete Complaint Ticket': props<{
      agentId: string;
      complaintTicketId: string;
    }>(),
    'Delete Complaint Ticket Success': props<{ complaintTicketId: string }>(),
    'Delete Complaint Ticket Failure': props<{ error: ApiError }>(),

    //** Complaint Categories
    // 1. Load Complaint Categories
    // 2. Load Complaint Category
    // 3. Create Complaint Category
    // 4. Update Complaint Category
    // 5. Delete Complaint Category
    // */
    'Load Complaint Categories': props<{
      agentId: string;
      pageNumber: number;
      pageSize: number;
    }>(),
    'Load Complaint Categories Success': props<{
      paginatedComplaintCategories: PaginatedEntity<ComplaintCategoryEntity>;
    }>(),
    'Load Complaint Categories Failure': props<{ error: ApiError }>(),
    'Load Complaint Category': props<{
      agentId: string;
      complaintCategoryId: string;
    }>(),
    'Load Complaint Category Success': props<{
      complaintCategory: ComplaintCategoryEntity;
    }>(),
    'Load Complaint Category Failure': props<{ error: ApiError }>(),
    'Create Complaint Category': props<{
      agentId: string;
      complaintCategory: ComplaintCategoryEntity;
    }>(),
    'Create Complaint Category Success': props<{
      complaintCategory: ComplaintCategoryEntity;
    }>(),
    'Create Complaint Category Failure': props<{ error: ApiError }>(),
    'Update Complaint Category': props<{
      agentId: string;
      complaintCategory: ComplaintCategoryEntity;
    }>(),
    'Update Complaint Category Success': props<{
      complaintCategory: ComplaintCategoryEntity;
    }>(),
    'Update Complaint Category Failure': props<{ error: ApiError }>(),
    'Delete Complaint Category': props<{
      agentId: string;
      complaintCategoryId: string;
    }>(),
    'Delete Complaint Category Success': props<{
      complaintCategoryId: string;
    }>(),
    'Delete Complaint Category Failure': props<{ error: ApiError }>(),

    //** Complaint Conversations
    // 1. Load Complaint Conversations Summaries
    // 2. Load Complaint Conversation details
    // 3. Start Complaint Conversation
    // 4. Send Complaint Text Message
    // 5. Send Complaint Audio Message
    // */
    'Load Complaint Conversations Summaries': props<{
      agentId: string;
      pageNumber: number;
      pageSize: number;
    }>(),
    'Load Complaint Conversations Summaries Success': props<{
      paginatedComplaintConversations: PaginatedEntity<ConversationSummaryEntity>;
    }>(),
    'Load Complaint Conversations Summaries Failure': props<{ error: ApiError }>(),
    'Load Complaint Conversation Details': props<{
      agentId: string;
      complaintConversationId: string;
    }>(),
    'Load Complaint Conversation Details Success': props<{
      complaintConversation: ConversationEntity;
    }>(),
    'Load Complaint Conversation Details Failure': props<{ error: ApiError }>(),
    'Start Complaint Conversation': props<{ agentId: string }>(),
    'Start Complaint Conversation Success': props<{
      complaintConversation: ConversationSummaryEntity;
    }>(),
    'Start Complaint Conversation Failure': props<{ error: ApiError }>(),
    'Send Complaint Text Message': props<{
      agentId: string;
      conversationId: string;
      textMessage: string;
    }>(),
    'Send Complaint Text Message Success': props<{
      message: ConversationMessageEntity;
    }>(),
    'Send Complaint Text Message Failure': props<{ error: ApiError }>(),
    'Send Complaint Audio Message': props<{
      agentId: string;
      conversationId: string;
      audioMessage: File;
    }>(),
    'Send Complaint Audio Message Success': props<{
      message: ConversationMessageEntity;
    }>(),
    'Send Complaint Audio Message Failure': props<{ error: ApiError }>(),
  },
});
