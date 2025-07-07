// src/app/features/agents/agents.routes.ts

import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { agentsReducer } from './presentation/store/agents.reducer';
import { AgentsEffects } from './presentation/store/agents.effects';
import { AGENTS_REPOSITORY } from './data/services/agents.provider';
import { AgentsService } from './data/services/agents.service';
import { AgentsMockService } from './data/services/agents-mock.service';
import { environment } from '../../../environments/environment';

export const agentsRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState('agents', agentsReducer),
      provideEffects([AgentsEffects]),
      {
        provide: AGENTS_REPOSITORY,
        useClass: environment.production ? AgentsService : AgentsMockService
      }
    ],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => 
          import('./presentation/pages/agents-list/agents-list.component').then(
            m => m.AgentsListComponent
          ),
        title: 'AI Agents'
      }
    //   {
    //     path: ':id/configure',
    //     loadComponent: () => 
    //       import('./presentation/pages/agent-configure/agent-configure.component').then(
    //         m => m.AgentConfigureComponent
    //       ),
    //     title: 'Configure Agent'
    //   },
    //   {
    //     path: ':id',
    //     loadComponent: () => 
    //       import('./presentation/pages/agent-detail/agent-detail.component').then(
    //         m => m.AgentDetailComponent
    //       ),
    //     title: 'Agent Details'
    //   }
    ]
  }
];