export interface ConversationEntity {
  id:                 string;
  conversation_title: string;
  messages:           ConversationMessageEntity[];
}

export interface ConversationMessageEntity {
  message_type:  string;
  content:       string;
  audio_content: string| null;
  message_date:  Date;
}
