import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { AgentsActions } from './agents.actions';
import { GetAgentsUseCaseService } from '../../../application/use-case/get-agents.use-case.service';
import { GetAgentByIdUseCaseService } from '../../../application/use-case/get-agent-by-id.use-case.service';
import { ConfigureAgentUseCaseService } from '../../../application/use-case/configure-agent.use-case.service';
import { AgentMapper } from '../../../application/mappers/agent.mapper';
import { Router } from '@angular/router';

@Injectable()
export class AgentsEffects {
  loadAgents$;
  loadAgent$;

  constructor(
    private actions$: Actions,
    private getAgentsUseCase: GetAgentsUseCaseService,
    private getAgentByIdUseCase: GetAgentByIdUseCaseService,
    private configureAgentUseCase: ConfigureAgentUseCaseService,
    private router: Router
  ) {
    this.loadAgents$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AgentsActions.loadAgents),
        mergeMap(() =>
          this.getAgentsUseCase.execute().pipe(
            map((agentsSummary) => {
              return AgentsActions.loadAgentsSuccess({ agents: agentsSummary });
            }),
            catchError((error) => {
              console.error('Error loading agents:', error);
              return of(
                AgentsActions.loadAgentsFailure({
                  error: error.message || 'Failed to load agents',
                })
              );
            })
          )
        )
      )
    );

    this.loadAgent$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AgentsActions.loadAgent),
        mergeMap(({ id }) =>
          this.getAgentByIdUseCase.execute(id).pipe(
            map((agentDto) => {
              const agent = AgentMapper.toEntity(agentDto);
              return AgentsActions.loadAgentSuccess({ agent });
            }),
            catchError((error) => {
              console.error('Error loading agent:', error);
              return of(
                AgentsActions.loadAgentFailure({
                  error: error.message || 'Failed to load agent',
                })
              );
            })
          )
        )
      )
    );
  }
}
