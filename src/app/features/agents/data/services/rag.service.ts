import { Inject, Injectable } from '@angular/core';
import { RagRepository } from '../../domain/repositories/rag.repository';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_API_URL } from '../../../../app.config';
import { Observable } from 'rxjs';
import { DocumentEntity } from '../../domain/entities/document.enttity';
import {
  ConversationEntity,
  ConversationMessageEntity,
} from '../../domain/entities/conversation.entity';
import { ConversationSummaryEntity } from '../../domain/entities/conversation-summary.entity';
import {
  RagDocumentModel,
  RagConversationModel,
  RagConversationMessageModel,
  RagConversationSummaryModel,
  CreateRagConversationModel,
  RagConversationMessageReplyModel,
} from '../models/rag.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { handleResponse } from '../../../../shared/utils/handle-reponses.util';
import { PaginatedEntity } from '../../../../core/entities/paginated.entity';
import { PaginatedModel } from '../../../../core/models/paginated.model';
import { mapPaginationModelIntoEntity } from '../../../../shared/utils/map-pagination-model-into-entity.util';

@Injectable({
  providedIn: 'root',
})
export class RagService implements RagRepository {
  private readonly apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(BASE_API_URL) private baseUrl: string
  ) {
    this.apiUrl = `${this.baseUrl}/agents_lab`;
  }

  getRagDocuments(
    agentId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedEntity<DocumentEntity>> {
    const params = new HttpParams()
      .set('agent_id', agentId)
      .set('page_number', pageNumber.toString())
      .set('page_size', pageSize.toString());
    const response$ = this.http.get<
      ApiResponse<PaginatedModel<RagDocumentModel>>
    >(`${this.apiUrl}/rag/documents/`, { params });

    return handleResponse<
      PaginatedModel<RagDocumentModel>,
      PaginatedEntity<DocumentEntity>
    >(response$, (models) =>
      mapPaginationModelIntoEntity<RagDocumentModel, DocumentEntity>(
        models,
        this.mapDocumentModelToEntity.bind(this)
      )
    );
  }

  uploadRagDocument(
    agentId: string,
    file: File
  ): Observable<DocumentEntity> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('agent_id', agentId);

    const response$ = this.http.post<ApiResponse<RagDocumentModel>>(
      `${this.apiUrl}/rag/documents/upload/`,
      formData
    );

    return handleResponse<RagDocumentModel, DocumentEntity>(
      response$,
      this.mapDocumentModelToEntity.bind(this)
    );
  }

  getRagConversationsSummaries(
    agentId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedEntity<ConversationSummaryEntity>> {
    const params = new HttpParams()
      .set('agent_id', agentId)
      .set('page_number', pageNumber.toString())
      .set('page_size', pageSize.toString());
    const response$ = this.http.get<
      ApiResponse<PaginatedModel<RagConversationSummaryModel>>
    >(`${this.apiUrl}/conversations/`, { params });

    return handleResponse<
      PaginatedModel<RagConversationSummaryModel>,
      PaginatedEntity<ConversationSummaryEntity>
    >(response$, (models) =>
      mapPaginationModelIntoEntity<
        RagConversationSummaryModel,
        ConversationSummaryEntity
      >(models, this.mapConversationSummaryModelToEntity.bind(this))
    );
  }

  getRagConversation(id: string): Observable<ConversationEntity> {
    const response$ = this.http.get<ApiResponse<RagConversationModel>>(
      `${this.apiUrl}/conversations/${id}`
    );

    return handleResponse<RagConversationModel, ConversationEntity>(
      response$,
      this.mapConversationModelToEntity.bind(this)
    );
  }

  startRagConversation(agentId: string): Observable<ConversationSummaryEntity> {
    const params = new HttpParams().set('agent_id', agentId);
    const url = `${this.apiUrl}/conversations/create/`;
    const response$ = this.http.post<ApiResponse<CreateRagConversationModel>>(
      url,
      {},
      { params }
    );

    return handleResponse<CreateRagConversationModel, ConversationSummaryEntity>(
      response$,
      (model) => {
        // Return a placeholder entity that will be replaced by the actual conversation
        return {
          id: model.id,
          conversation_title: model.conversation_title,
          last_active: model.created_date,
          status: model.status,
        };
      }
    );
  }

  sendRagTextMessage(
    agentId: string,
    conversationId: string,
    textMessage: string
  ): Observable<ConversationMessageEntity> {
    const params = new HttpParams().set('agent_id', agentId);
    const url = `${this.apiUrl}/conversations/${conversationId}/send_message/`
    const response$ = this.http.post<ApiResponse<RagConversationMessageReplyModel>>(
      url,
      { message: textMessage },
      { params }
    );

    return handleResponse<
    RagConversationMessageReplyModel,
      ConversationMessageEntity
    >(response$, this.mapConversationMessageReplyModelToEntity.bind(this));
  }

  sendRagAudioMessage(
    agentId: string,
    conversationId: string,
    audioMessage: File
  ): Observable<ConversationMessageEntity> {
    const formData = new FormData();
    formData.append('message', audioMessage);
    const params = new HttpParams().set('agent_id', agentId);
    const url = `${this.apiUrl}/conversations/${conversationId}/send_audio_message/`
    const response$ = this.http.post<ApiResponse<RagConversationMessageReplyModel>>(
      url,
      formData,
      { params }
    );

    return handleResponse<
    RagConversationMessageReplyModel,
      ConversationMessageEntity
    >(response$, this.mapConversationMessageReplyModelToEntity.bind(this));
  }

  // Private mapper methods
  private mapDocumentModelToEntity(model: RagDocumentModel): DocumentEntity {
    return {
      id: model.id,
      filename: model.name,
      uploadDate: model.uploaded_on,
      type: model.type || 'unknown',
      status: 'active',
    };
  }

  private mapConversationModelToEntity(
    model: RagConversationModel
  ): ConversationEntity {
    return {
      id: model.id,
      conversation_title: model.conversation_title,
      messages: model.messages.map(
        this.mapConversationMessageModelToEntity.bind(this)
      ),
    };
  }

  private mapConversationMessageModelToEntity(
    model: RagConversationMessageModel
  ): ConversationMessageEntity {
    return {
      message_type: model.message_type,
      content: model.content,
      audio_content: model.audio_content,
      message_date: new Date(model.message_date),
    };
  }

  private mapConversationMessageReplyModelToEntity(
    model: RagConversationMessageReplyModel
  ): ConversationMessageEntity {
    return {
      message_type: model.type,
      content: model.content,
      audio_content: model.media_content,
      message_date: new Date(model.time),
    };
  }

  private mapConversationSummaryModelToEntity(
    model: RagConversationSummaryModel
  ): ConversationSummaryEntity {
    return {
      id: model.id,
      conversation_title: model.conversation_title,
      last_active: new Date(model.last_active),
      status: model.status,
    };
  }
}
