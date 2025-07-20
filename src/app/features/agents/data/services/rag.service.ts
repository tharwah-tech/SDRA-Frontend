import { Inject, Injectable } from '@angular/core';
import { RagRepository } from '../../domain/repositories/rag.repository';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_API_URL } from '../../../../app.config';
import { Observable } from 'rxjs';
import { RagDocumentEntity } from '../../domain/entities/rag-document.enttity';
import {
  RagConversationEntity,
  RagConversationMessageEntity,
} from '../../domain/entities/rag-conversation.entity';
import { RagConversationSummaryEntity } from '../../domain/entities/rag-conversation-summary.entity';
import {
  RagDocumentModel,
  RagConversationModel,
  RagConversationMessageModel,
  RagConversationSummaryModel,
  CreateRagConversationModel,
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
  ): Observable<PaginatedEntity<RagDocumentEntity>> {
    const params = new HttpParams()
      .set('agent_id', agentId)
      .set('page_number', pageNumber.toString())
      .set('page_size', pageSize.toString());
    const response$ = this.http.get<
      ApiResponse<PaginatedModel<RagDocumentModel>>
    >(`${this.apiUrl}/rag/documents/`, { params });

    return handleResponse<
      PaginatedModel<RagDocumentModel>,
      PaginatedEntity<RagDocumentEntity>
    >(response$, (models) =>
      mapPaginationModelIntoEntity<RagDocumentModel, RagDocumentEntity>(
        models,
        this.mapDocumentModelToEntity.bind(this)
      )
    );
  }

  uploadRagDocument(
    agentId: string,
    file: File
  ): Observable<RagDocumentEntity> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('agent_id', agentId);

    const response$ = this.http.post<ApiResponse<RagDocumentModel>>(
      `${this.apiUrl}/rag/documents/upload/`,
      formData
    );

    return handleResponse<RagDocumentModel, RagDocumentEntity>(
      response$,
      this.mapDocumentModelToEntity.bind(this)
    );
  }

  getRagConversationsSummaries(
    agentId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedEntity<RagConversationSummaryEntity>> {
    const params = new HttpParams()
      .set('agent_id', agentId)
      .set('page_number', pageNumber.toString())
      .set('page_size', pageSize.toString());
    const response$ = this.http.get<
      ApiResponse<PaginatedModel<RagConversationSummaryModel>>
    >(`${this.apiUrl}/conversations/`, { params });

    return handleResponse<
      PaginatedModel<RagConversationSummaryModel>,
      PaginatedEntity<RagConversationSummaryEntity>
    >(response$, (models) =>
      mapPaginationModelIntoEntity<
        RagConversationSummaryModel,
        RagConversationSummaryEntity
      >(models, this.mapConversationSummaryModelToEntity.bind(this))
    );
  }

  getRagConversation(id: string): Observable<RagConversationEntity> {
    const response$ = this.http.get<ApiResponse<RagConversationModel>>(
      `${this.apiUrl}/conversations/${id}`
    );

    return handleResponse<RagConversationModel, RagConversationEntity>(
      response$,
      this.mapConversationModelToEntity.bind(this)
    );
  }

  startRagConversation(agentId: string): Observable<RagConversationSummaryEntity> {
    const params = new HttpParams().set('agent_id', agentId);
    const url = `${this.apiUrl}/conversations/create/`;
    const response$ = this.http.post<ApiResponse<CreateRagConversationModel>>(
      url,
      {},
      { params }
    );

    return handleResponse<CreateRagConversationModel, RagConversationSummaryEntity>(
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
    conversationId: string,
    textMessage: string
  ): Observable<RagConversationMessageEntity> {
    const response$ = this.http.post<ApiResponse<RagConversationMessageModel>>(
      `${this.apiUrl}/conversations/${conversationId}/messages/text`,
      { message: textMessage }
    );

    return handleResponse<
      RagConversationMessageModel,
      RagConversationMessageEntity
    >(response$, this.mapConversationMessageModelToEntity.bind(this));
  }

  sendRagAudioMessage(
    conversationId: string,
    audioMessage: string
  ): Observable<RagConversationMessageEntity> {
    const formData = new FormData();
    formData.append('audio', audioMessage);

    const response$ = this.http.post<ApiResponse<RagConversationMessageModel>>(
      `${this.apiUrl}/conversations/${conversationId}/messages/audio`,
      formData
    );

    return handleResponse<
      RagConversationMessageModel,
      RagConversationMessageEntity
    >(response$, this.mapConversationMessageModelToEntity.bind(this));
  }

  // Private mapper methods
  private mapDocumentModelToEntity(model: RagDocumentModel): RagDocumentEntity {
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
  ): RagConversationEntity {
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
  ): RagConversationMessageEntity {
    return {
      message_type: model.message_type,
      content: model.content,
      audio_content: model.audio_content,
      message_date: new Date(model.message_date),
    };
  }

  private mapConversationSummaryModelToEntity(
    model: RagConversationSummaryModel
  ): RagConversationSummaryEntity {
    return {
      id: model.id,
      conversation_title: model.conversation_title,
      last_active: new Date(model.last_active),
      status: model.status,
    };
  }
}
