export interface RagConversationEntity {
  id:                 string;
  conversation_title: string;
  messages:           RagConversationMessageEntity[];
}

export interface RagConversationMessageEntity {
  message_type:  string;
  content:       string;
  audio_content: string;
  message_date:  Date;
}
