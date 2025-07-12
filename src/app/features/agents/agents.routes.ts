// src/app/features/agents/agents.routes.ts

import { Routes } from '@angular/router';
import { AgentViewPageComponent } from './presentation/pages/agent-view-page/agent-view-page.component';
import { AgentsPageComponent } from './presentation/pages/agents-page/agents-page.component';
import { CreateAgentPageComponent } from './presentation/pages/create-agent-page/create-agent-page.component';
import { agentsFeatureProviders } from './agents.providers';

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
        path: 'create',
        component: CreateAgentPageComponent,
        title: 'Create Agent',
      },
      {
        path: 'agent/:id',
        component: AgentViewPageComponent,
        title: 'Agent Details',
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];