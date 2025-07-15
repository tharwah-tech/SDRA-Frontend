import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { filter, Observable, Subject, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectInterviewsError,
  selectInterviewsLoading,
  selectSelectedInterviewLink,
} from '../../store/interviews/interviews.selectors';
import { ApiError } from '../../../../../core/models/api-error.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InterviewsActions } from '../../store/interviews/interviews.actions';

@Component({
  selector: 'app-start-interview-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule,
  ],
  templateUrl: './start-interview-page.component.html',
  styleUrl: './start-interview-page.component.scss',
})
export class StartInterviewPageComponent implements OnInit {
  // Component state signals
  token = signal<string | null>(null);
  interviewLink$: Observable<string | null>;
  interviewUrl = signal<string | null>(null);
  loading$: Observable<boolean>;
  error$: Observable<ApiError | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {
    this.interviewLink$ = this.store.select(selectSelectedInterviewLink);
    this.loading$ = this.store.select(selectInterviewsLoading);
    this.error$ = this.store.select(selectInterviewsError);
  }

  // Make route accessible in template
  get routeSnapshot() {
    return this.route;
  }

  ngOnInit(): void {
    this.loadInterviewData();
    this.interviewLink$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((val) => !!val),
        tap((link) => this.interviewUrl.set(link))
      )
      .subscribe();
  }

  private loadInterviewData(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const token = params['token'];

        if (token) {
          this.token.set(token);
          this.store.dispatch(InterviewsActions.setInteviewToken(token));
          this.fetchInterviewUrl(token);
        } else {
          // this.error$.set('Token not found in URL parameters');
          this.store.dispatch(
            InterviewsActions.setError({
              error: {
                message: 'Token not found in URL parameters',
                errors: ['Missing Token'],
                statusCode: 400,
              },
            })
          );
        }
      });
  }

  private fetchInterviewUrl(token: string): void {
    // Step 2: Get the interview URL using the token
    this.store.dispatch(InterviewsActions.getInterviewLink({ token }));
  }

  onStartInterview(): void {
    const url = this.interviewUrl();
    if (url) {
      // Open the interview URL in a new tab/window
      window.open(url, '_blank');
    } else {
      console.error('Interview URL not available');
    }
  }

  onRetry(): void {
    const token = this.token();
    if (token) {
      this.fetchInterviewUrl(token);
    }
  }

  copyToClipboard(input: HTMLInputElement): void {
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices

    try {
      document.execCommand('copy');
      console.log('Interview URL copied to clipboard');
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy interview URL:', err);
    }
  }
}
