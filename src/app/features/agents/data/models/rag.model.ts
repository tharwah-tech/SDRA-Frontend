export interface RagDocumentModel {
  id: string;
  name: string;
  uploaded_on: Date;
  type: string;
}

export interface RagConversationModel {
  id: string;
  conversation_title: string;
  messages: RagConversationMessageModel[];
}

export interface RagConversationMessageModel {
  message_type: string;
  content: string;
  audio_content: string;
  message_date: string;
}

export interface RagConversationSummaryModel {
  id: string;
  conversation_title: string;
  last_active: string;
  status: string;
}

export interface CreateRagConversationModel {
  id:                 string;
  conversation_title: string;
  agent_id:           string;
  status:             string;
  created_date:       Date;
}
