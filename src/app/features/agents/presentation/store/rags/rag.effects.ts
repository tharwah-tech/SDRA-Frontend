
import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RagRepository } from '../../../domain/repositories/rag.repository';
import { RAGS_REPOSITORY } from '../../../data/services/rag.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { RagsActions } from './rag.actions';
import { ToastrService } from 'ngx-toastr';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';
import { Store } from '@ngrx/store';

@Injectable()
export class RagsEffects {
  loadRagDocuments$: Observable<any>;
  loadRagDocumentsSuccess$: Observable<any>;

  uploadRagDocument$: Observable<any>;
  uploadRagDocumentSuccess$: Observable<any>;

  loadRagConversationSummaries$: Observable<any>;
  loadRagConversationSummariesSuccess$: Observable<any>;

  loadRagConversation$: Observable<any>;
  loadRagConversationSuccess$: Observable<any>;

  startRagConversation$: Observable<any>;
  startRagConversationSuccess$: Observable<any>;

  sendRagTextMessage$: Observable<any>;
  sendRagTextMessageSuccess$: Observable<any>;

  sendRagAudioMessage$: Observable<any>;
  sendRagAudioMessageSuccess$: Observable<any>;

  constructor(
    private actions$: Actions,
    @Inject(RAGS_REPOSITORY) private ragRepository: RagRepository,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.loadRagDocuments$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RagsActions.loadRagDocuments),
        switchMap((action) =>
          this.ragRepository
            .getRagDocuments(action.agentId, action.pageNumber, action.pageSize)
            .pipe(
              map((paginatedDocuments) =>
                RagsActions.loadRagDocumentsSuccess({ paginatedDocuments })
              ),
              catchError((error) =>
                of(RagsActions.loadRagDocumentsFailure({ error }))
              )
            )
        )
      )
    );

    this.loadRagDocumentsSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(RagsActions.loadRagDocumentsSuccess),
          tap((action) => {})
        ),
      { dispatch: false }
    );

    this.uploadRagDocument$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RagsActions.uploadRagDocument),
        switchMap((action) =>
          this.ragRepository
            .uploadRagDocument(action.agentId, action.file)
            .pipe(
              map((document) =>
                RagsActions.uploadRagDocumentSuccess({ agentId: action.agentId, document })
              ),
              catchError((error) =>
                of(RagsActions.uploadRagDocumentFailure({ error }))
              )
            )
        )
      )
    );

    this.uploadRagDocumentSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(RagsActions.uploadRagDocumentSuccess),
          switchMap((action) => this.ragRepository.getRagDocuments(action.agentId, 1, 5).pipe(
            map((paginatedDocuments) =>
              RagsActions.loadRagDocumentsSuccess({ paginatedDocuments })
            ),
            catchError((error) =>
              of(RagsActions.loadRagDocumentsFailure({ error }))
            )
          ))
        )
    );

    this.loadRagConversationSummaries$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RagsActions.loadRagConversationsSummaries),
        switchMap((action) =>
          this.ragRepository
            .getRagConversationsSummaries(
              action.agentId,
              action.pageNumber,
              action.pageSize
            )
            .pipe(
              map((paginatedConversationSummaryList) =>
                RagsActions.loadRagConversationsSummariesSuccess({
                  paginatedConversationSummaryList,
                })
              ),
              catchError((error) =>
                of(RagsActions.loadRagConversationsSummariesFailure({ error }))
              )
            )
        )
      )
    );

    this.loadRagConversationSummariesSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(RagsActions.loadRagConversationsSummariesSuccess),
          tap((action) => {
            // Removed success notification for loading conversations
            // as it's not needed and might be annoying
          })
        ),
      { dispatch: false }
    );

    this.loadRagConversation$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RagsActions.loadRagConversation),
        switchMap((action) =>
          this.ragRepository.getRagConversation(action.id).pipe(
            map((conversation) =>
              RagsActions.loadRagConversationSuccess({ conversation })
            ),
            catchError((error) =>
              of(RagsActions.loadRagConversationFailure({ error }))
            )
          )
        )
      )
    );

    this.loadRagConversationSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(RagsActions.loadRagConversationSuccess),
          tap((action) => {
            const currentUrl = this.router.url;
            const urlSegments = currentUrl.split('/');
            const lang = urlSegments[1] || 'en';
            const agentId = urlSegments[4] || '';
            const url = `/${lang}/agents/agent/${agentId}/chat/${action.conversation.id}`
            console.log(url);
            this.router.navigate([url]);
          })
        ),
      { dispatch: false }
    );

    this.startRagConversation$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RagsActions.startRagConversation),
        switchMap((action) =>
          this.ragRepository.startRagConversation(action.agentId).pipe(
            map((conversation) =>
              RagsActions.startRagConversationSuccess({ conversation })
            ),
            catchError((error) =>
              of(RagsActions.startRagConversationFailure({ error }))
            )
          )
        )
      )
    );

    this.startRagConversationSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(RagsActions.startRagConversationSuccess),
          map((action) => RagsActions.loadRagConversation({ id: action.conversation.id }))
        )
    );

    this.sendRagTextMessage$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RagsActions.sendRagTextMessage),
        switchMap((action) =>
          this.ragRepository
            .sendRagTextMessage(action.agentId, action.conversationId, action.textMessage)
            .pipe(
              map((message) =>
                RagsActions.sendRagTextMessageSuccess({ message })
              ),
              catchError((error) =>
                of(RagsActions.sendRagTextMessageFailure({ error }))
              )
            )
        )
      )
    );

    this.sendRagTextMessageSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(RagsActions.sendRagTextMessageSuccess),
          tap((action) => {
            // showSnackbar(this.toastr, {
            //   title: action.message.content,
            //   type: 'success',
            // });
          })
        ),
      { dispatch: false }
    );

    this.sendRagAudioMessage$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RagsActions.sendRagAudioMessage),
        switchMap((action) =>
          this.ragRepository
            .sendRagAudioMessage(action.agentId, action.conversationId, action.audioMessage)
            .pipe(
              map((message) =>
                RagsActions.sendRagAudioMessageSuccess({ message })
              ),
              catchError((error) =>
                of(RagsActions.sendRagAudioMessageFailure({ error }))
              )
            )
        )
      )
    );

    this.sendRagAudioMessageSuccess$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(RagsActions.sendRagAudioMessageSuccess),
          tap((action) => {
            // showSnackbar(this.toastr, {
            //   title: 'Audio message sent successfully',
            //   type: 'success',
            // });
          })
        ),
      { dispatch: false }
    );
  }
}
