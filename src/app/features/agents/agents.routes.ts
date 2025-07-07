
import { Routes } from '@angular/router';

export const agentsRoutes: Routes = [
  {
    path: '',
    // Removed all providers since they're now handled globally in app.config.ts
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