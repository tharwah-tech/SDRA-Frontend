// src/app/features/agents/agents.routes.ts

import { Routes } from '@angular/router';
import { AgentViewPageComponent } from './presentation/pages/agent-view-page/agent-view-page.component';
import { AgentsPageComponent } from './presentation/pages/agents-page/agents-page.component';
import { CreateAgentPageComponent } from './presentation/pages/create-agent-page/create-agent-page.component';
import { agentsFeatureProviders } from './agents.providers';
import { CreateInterviewPageComponent } from './presentation/pages/create-interview-page/create-interview-page.component';
import { ViewInterviewDetailsPageComponent } from './presentation/pages/view-interview-details-page/view-interview-details-page.component';
import { StartInterviewPageComponent } from './presentation/pages/start-interview-page/start-interview-page.component';
import { CompleteInterviewPageComponent } from './presentation/pages/complete-interview-page/complete-interview-page.component';
import { AgnetChatPageComponent } from './presentation/pages/agnet-chat-page/agnet-chat-page.component';

export const AGENTS_ROUTES: Routes = [
  {
    path: '',
    providers: agentsFeatureProviders, // Feature-level providers
    children: [
      {
        path: '',
        component: AgentsPageComponent,
        title: 'AI Agents',
      },
      {
        path: 'create-agent',
        component: CreateAgentPageComponent,
        title: 'Create Agent',
      },
      {
        path: 'agent/:id',
        component: AgentViewPageComponent,
        title: 'Agent Details',
      },
      {
        path: 'agent/:id/create-interview',
        component: CreateInterviewPageComponent,
        title: 'Create Interview',
      },
      {
        path: 'agent/:id/interview-details/:interviewId',
        component: ViewInterviewDetailsPageComponent,
        title: 'Interview Details',
      },
      {
        // Public route - no authentication required
        path: 'agents_lab/interviewer/interviews/start',
        component: StartInterviewPageComponent,
        title: 'Start Interview',
      },
      {
        // Public route - no authentication required
        path: 'agents_lab/interviewer/interviews/completed',
        component: CompleteInterviewPageComponent,
        title: 'Complete Interview',
      },
      {
        path: 'agent/:agentId/chat/:conversationId',
        component: AgnetChatPageComponent,
        title: 'Agent Chat',
      },
      {
        path: 'rag/conversation/:conversationId',
        component: AgnetChatPageComponent,
        title: 'RAG Conversation',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
