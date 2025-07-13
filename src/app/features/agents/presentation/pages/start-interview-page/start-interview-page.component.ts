
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { InterviewShareService, InterviewShareResult } from '../../../data/services/interview-share.service';

@Component({
  selector: 'app-start-interview-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './start-interview-page.component.html',
  styleUrl: './start-interview-page.component.scss'
})
export class StartInterviewPageComponent implements OnInit, OnDestroy {
  // Component state signals
  interviewId = signal<string | null>(null);
  interviewUrl = signal<string | null>(null);
  token = signal<string | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private interviewShareService: InterviewShareService
  ) {}

  // Make route accessible in template
  get routeSnapshot() {
    return this.route;
  }

  ngOnInit(): void {
    this.loadInterviewData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInterviewData(): void {
    // Get interview_id from query parameters
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const interviewId = params['interview_id'];
      
      if (interviewId) {
        this.interviewId.set(interviewId);
        this.fetchInterviewShareUrl(interviewId);
      } else {
        this.error.set('Interview ID not found in URL parameters');
      }
    });
  }

  private fetchInterviewShareUrl(interviewId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.interviewShareService.getInterviewShareUrl(interviewId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result: InterviewShareResult) => {
        this.interviewUrl.set(result.interviewUrl);
        this.token.set(result.token);
        this.loading.set(false);
        console.log('Interview share data loaded successfully:', result);
      },
      error: (error) => {
        this.error.set(error.message || 'Failed to load interview data');
        this.loading.set(false);
        console.error('Error loading interview share data:', error);
      }
    });
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
    const interviewId = this.interviewId();
    if (interviewId) {
      this.fetchInterviewShareUrl(interviewId);
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