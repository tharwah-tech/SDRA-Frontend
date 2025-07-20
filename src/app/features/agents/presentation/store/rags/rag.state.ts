
import { ApiError } from "../../../../../core/models/api-error.model";
import { RagConversationSummaryEntity } from "../../../domain/entities/rag-conversation-summary.entity";
import { RagConversationEntity } from "../../../domain/entities/rag-conversation.entity";
import { RagDocumentEntity } from "../../../domain/entities/rag-document.enttity";
import { PaginationMetadata } from "../../../../../core/entities/paginator.entity";

export const RAG_FEATURE_KEY = 'rags';

export interface RagState {
  documentsList: RagDocumentEntity[];
  documentsPagination: PaginationMetadata | null;
  conversationSummaryList: RagConversationSummaryEntity[];
  conversationsPagination: PaginationMetadata | null;
  selectedConversation: RagConversationEntity | null;
  selectedConversationId: string | null;
  loading: boolean;
  error: ApiError | null;
}

export const initialRagState: RagState = {
  documentsList: [],
  documentsPagination: null,
  conversationSummaryList: [],
  selectedConversation: {
    id: 'dummy-conversation-123',
    conversation_title: 'Test Conversation with AI Agent',
    messages: [
      {
        message_type: 'user',
        content: 'Hello! Can you help me with some information about Angular development?',
        audio_content: '',
        message_date: new Date(Date.now() - 300000), // 5 minutes ago
      },
      {
        message_type: 'agent',
        content: 'Hello! I\'d be happy to help you with Angular development. What specific questions do you have? I can assist with components, services, routing, state management, and many other Angular topics.',
        audio_content: '',
        message_date: new Date(Date.now() - 240000), // 4 minutes ago
      },
      {
        message_type: 'user',
        content: 'I\'m having trouble with reactive forms. Can you explain how to implement form validation?',
        audio_content: '',
        message_date: new Date(Date.now() - 180000), // 3 minutes ago
      },
      {
        message_type: 'agent',
        content: 'Of course! Reactive forms in Angular use FormControl, FormGroup, and FormArray classes. Here\'s a basic example:\n\n```typescript\nimport { FormBuilder, FormGroup, Validators } from \'@angular/forms\';\n\nconstructor(private fb: FormBuilder) {\n  this.form = this.fb.group({\n    name: [\'\', [Validators.required, Validators.minLength(2)]],\n    email: [\'\', [Validators.required, Validators.email]]\n  });\n}\n```\n\nYou can add validators like required, email, minLength, maxLength, and custom validators.',
        audio_content: '',
        message_date: new Date(Date.now() - 120000), // 2 minutes ago
      },
      {
        message_type: 'user',
        content: 'That\'s very helpful! How do I handle form submission?',
        audio_content: '',
        message_date: new Date(Date.now() - 60000), // 1 minute ago
      },
      {
        message_type: 'agent',
        content: 'To handle form submission, you can use the (ngSubmit) event or listen to form value changes. Here\'s an example:\n\n```typescript\nonSubmit() {\n  if (this.form.valid) {\n    console.log(this.form.value);\n    // Submit to your API\n  }\n}\n```\n\nYou can also use form.valueChanges to react to form changes in real-time.',
        audio_content: '',
        message_date: new Date(Date.now() - 30000), // 30 seconds ago
      },
    ],
  },
  selectedConversationId: 'dummy-conversation-123',
  conversationsPagination: null,
  selectedConversation: null,
  selectedConversationId: null,
  loading: false,
  error: null,
};
