// src/app/features/agents/presentation/store/interviews/interviews.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { InterviewsActions } from './interviews.actions';
import { GetInterviewsUseCaseService } from '../../../application/use-case/get-interviews.use-case.service';
import { InterviewsService } from '../../../data/services/interviews.service';
import { GetInterviewDetailsUseCaseService } from '../../../application/use-case/get-interview-details.use-case.service';

@Injectable()
export class InterviewsEffects {
  // Declare effects as properties without initialization
  loadInterviews$: any;
  loadInterview$: any;
  updateInterviewStatus$: any;
  deleteInterview$: any;

  constructor(
    private actions$: Actions,
    private getInterviewsUseCase: GetInterviewsUseCaseService,
    private interviewsService: InterviewsService,
    private getInterviewDetailsUseCaseService: GetInterviewDetailsUseCaseService
  ) {
    console.log('InterviewsEffects constructor called');
    console.log('actions$:', this.actions$);
    console.log('getInterviewsUseCase:', this.getInterviewsUseCase);
    console.log('interviewsService:', this.interviewsService);

    // ✅ Initialize effects INSIDE constructor after services are injected
    this.loadInterviews$ = createEffect(() =>
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

    this.loadInterview$ = createEffect(() =>
      this.actions$.pipe(
        ofType(InterviewsActions.loadInterview),
        switchMap(({ id }) =>
          this.getInterviewDetailsUseCaseService.execute(id).pipe(
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

    this.updateInterviewStatus$ = createEffect(() =>
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

    this.deleteInterview$ = createEffect(() =>
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

    console.log('✅ All effects initialized successfully');
  }
}
