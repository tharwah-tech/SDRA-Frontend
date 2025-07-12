import { Routes } from '@angular/router';
import { AgentViewPageComponent } from './presentation/pages/agent-view-page/agent-view-page.component';
import { AgentsPageComponent } from './presentation/pages/agents-page/agents-page.component';
import { provideState } from '@ngrx/store';
import { AGENTS_FEATURE_KEY } from './presentation/store/agents.state';
import { agentsReducer } from './presentation/store/agents.reducer';
import { provideEffects } from '@ngrx/effects';
import { AgentsEffects } from './presentation/store/agents.effects';
import { CreateInterviewPageComponent } from './presentation/pages/create-interview-page/create-interview-page.component';

export const AGENTS_ROUTES: Routes = [
  {
    path: '',
    component: AgentsPageComponent,
    providers: [
      provideState(AGENTS_FEATURE_KEY, agentsReducer),
      provideEffects(AgentsEffects),
    ],
    title: 'AI Agents',
  },
  {
    path: 'agent/:id',
    component: AgentViewPageComponent,
    title: 'Agent Details',
    pathMatch: 'full',
  },
  {
    path: 'agent/:id/create-interview',
    component: CreateInterviewPageComponent,
    title: 'Create Interview',
    pathMatch: 'full',
  }
];
