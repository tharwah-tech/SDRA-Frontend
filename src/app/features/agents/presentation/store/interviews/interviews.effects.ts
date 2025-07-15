// src/app/features/agents/presentation/store/interviews/interviews.effects.ts

import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { InterviewsActions } from './interviews.actions';
import { GetInterviewsUseCaseService } from '../../../application/use-case/get-interviews.use-case.service';
import { InterviewsService } from '../../../data/services/interviews.service';
import { GetInterviewDetailsUseCaseService } from '../../../application/use-case/get-interview-details.use-case.service';
import { Router } from '@angular/router';
import { INTERVIEWS_REPOSITORY } from '../../../data/services/interviews.provider';
import { InterviewsRepository } from '../../../domain/repositories/interviews.repository';

@Injectable()
export class InterviewsEffects {
  // Declare effects as properties without initialization
  loadInterviews$: Observable<any>;
  loadInterview$: Observable<any>;
  updateInterviewStatus$: Observable<any>;
  deleteInterview$: Observable<any>;

  shareInterview$: Observable<any>;
  shareInterviewSuccess$: Observable<any>;

  getInterview$: Observable<any>;
  createInterview$: Observable<any>;
  createInterviewSuccess$: Observable<any>;

  constructor(
    private actions$: Actions,
    @Inject(INTERVIEWS_REPOSITORY)
    private interviewsRepository: InterviewsRepository,
    private getInterviewsUseCase: GetInterviewsUseCaseService,
    private interviewsService: InterviewsService,
    private getInterviewDetailsUseCaseService: GetInterviewDetailsUseCaseService,
    private router: Router
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
                InterviewsActions.loadInterviewsFailure({
                  error,
                })
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
              of(
                InterviewsActions.loadInterviewFailure({ error: error.message })
              )
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
                  error,
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
                InterviewsActions.deleteInterviewFailure({
                  error,
                })
              )
            )
          )
        )
      )
    );

    this.shareInterview$ = createEffect(() =>
      this.actions$.pipe(
        ofType(InterviewsActions.shareInterview),
        switchMap(({ interviewId }) =>
          this.interviewsRepository.getShareToken(interviewId).pipe(
            map((token) => InterviewsActions.shareInterviewSuccess({ token })),
            catchError((error) =>
              of(
                InterviewsActions.shareInterviewFailure({
                  error,
                })
              )
            )
          )
        )
      )
    );

    this.shareInterviewSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(InterviewsActions.shareInterviewSuccess),
          tap(({ token }) => {
            const currentUrl = this.router.url;
            const urlSegments = currentUrl.split('/');
            const lang = urlSegments[1] || 'en';
            console.log('token: ', token);

            this.router.navigate(
              [`/${lang}/agents/agents_lab/interviewer/interviews/start`],
              {
                queryParams: { token: token },
              }
            );
          })
        ),
      { dispatch: false }
    );

    this.getInterview$ = createEffect(() =>
      this.actions$.pipe(
        ofType(InterviewsActions.getInterviewLink),
        switchMap(({ token }) =>
          this.interviewsRepository.getInterviewLink(token).pipe(
            map((interviewLink) =>
              InterviewsActions.getInterviewLinkSuccess({ interviewLink })
            ),
            catchError((error) =>
              of(
                InterviewsActions.shareInterviewFailure({
                  error,
                })
              )
            )
          )
        )
      )
    );

    this.createInterview$ = createEffect(() =>
      this.actions$.pipe(
        ofType(InterviewsActions.createInterview),
        switchMap(({ interview }) =>
          this.interviewsRepository.createInterview(interview).pipe(
            map((interviewId) =>
              InterviewsActions.createInterviewSuccess(interviewId)
            ),
            catchError((error) => {
              console.log('create inteviiew error: ', error);
              return of(
                InterviewsActions.createInterviewFailure({
                  error,
                })
              );
            })
          )
        )
      )
    );

    this.createInterviewSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(InterviewsActions.createInterviewSuccess),
          tap(({ interviewId }) => {
            const currentUrl = this.router.url;
            const urlSegments = currentUrl.split('/');
            const lang = urlSegments[1] || 'en';
            const agentId = urlSegments[4] || '';
            console.log('interviewId: ', interviewId);

            this.router.navigate(
              [
                `/${lang}/agents/agent/${agentId}/interview-details/${interviewId}`,
              ],
              {
                queryParams: {},
              }
            );
          })
        ),
      { dispatch: false }
    );

    console.log('✅ All effects initialized successfully');
  }
}
