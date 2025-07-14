import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject, takeUntil } from 'rxjs';
import { InterviewShareService } from '../../../data/services/interview-share.service';

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
    RouterModule
  ],
  templateUrl: './start-interview-page.component.html',
  styleUrl: './start-interview-page.component.scss'
})
export class StartInterviewPageComponent implements OnInit, OnDestroy {
  // Component state signals
  token = signal<string | null>(null);
  interviewUrl = signal<string | null>(null);
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
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const token = params['token'];
      
      if (token) {
        this.token.set(token);
        this.fetchInterviewUrl(token);
      } else {
        this.error.set('Token not found in URL parameters');
      }
    });
  }

  private fetchInterviewUrl(token: string): void {
    this.loading.set(true);
    this.error.set(null);

    // Step 2: Get the interview URL using the token
    this.interviewShareService.getInterviewLink(token).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (interviewUrl: string) => {
        this.interviewUrl.set(interviewUrl);
        this.loading.set(false);
        console.log('Interview URL loaded successfully:', interviewUrl);
      },
      error: (error) => {
        this.error.set(error.message || 'Failed to load interview URL');
        this.loading.set(false);
        console.error('Error loading interview URL:', error);
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