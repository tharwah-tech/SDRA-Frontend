// src/app/features/agents/presentation/store/interviews.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { InterviewsActions } from './interviews.actions';
import { GetInterviewsUseCaseService } from '../../../application/use-case/get-interviews.use-case.service';
import { InterviewsService } from '../../../data/services/interviews.service';

@Injectable()
export class InterviewsEffects {
  constructor(
    private actions$: Actions,
    private getInterviewsUseCase: GetInterviewsUseCaseService,
    private interviewsService: InterviewsService
  ) {}

  loadInterviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InterviewsActions.loadInterviews),
      switchMap(() =>
        this.getInterviewsUseCase.execute().pipe(
          map((response) =>
            InterviewsActions.loadInterviewsSuccess({ response })
          ),
          catchError((error) =>
            of(
              InterviewsActions.loadInterviewsFailure({ error: error.message })
            )
          )
        )
      )
    )
  );

  loadInterview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InterviewsActions.loadInterview),
      switchMap(({ id }) =>
        this.getInterviewsUseCase.getInterviewById(id).pipe(
          map((interview) =>
            InterviewsActions.loadInterviewSuccess({ interview })
          ),
          catchError((error) =>
            of(InterviewsActions.loadInterviewFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateInterviewStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InterviewsActions.updateInterviewStatus),
      switchMap(({ id, status }) =>
        this.interviewsService.updateInterviewStatus(id, status).pipe(
          map((interview) =>
            InterviewsActions.updateInterviewStatusSuccess({ interview })
          ),
          catchError((error) =>
            of(
              InterviewsActions.updateInterviewStatusFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  deleteInterview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InterviewsActions.deleteInterview),
      switchMap(({ id }) =>
        this.interviewsService.deleteInterview(id).pipe(
          map(() => InterviewsActions.deleteInterviewSuccess({ id })),
          catchError((error) =>
            of(
              InterviewsActions.deleteInterviewFailure({ error: error.message })
            )
          )
        )
      )
    )
  );
}
