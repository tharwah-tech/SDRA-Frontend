import { Component, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, Observable, tap } from 'rxjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Entities & Enums
import {
  InterviewEntity,
  InterviewStatus,
} from '../../../../domain/entities/interview.entity';

// Facades
import { InterviewsFacade } from '../../../facades/interviews.facade';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { InterviewsActions } from '../../../store/interviews/interviews.actions';
import { showSnackbar } from '../../../../../../shared/utils/show-snackbar-notification.util';
import { ToastrService } from 'ngx-toastr';

// Import the InterviewShareService for API calls

@Component({
  selector: 'app-interview-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.scss'],
})
export class InterviewListComponent implements OnInit {
  // Component state
  currentPage = signal(1);
  pageSize = signal(10);
  selectedStatus = signal('all');

  // Observables
  interviews$: Observable<InterviewEntity[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  count$: Observable<number>;

  // Status filter options
  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: InterviewStatus.SCHEDULED, label: 'Scheduled' },
    { value: InterviewStatus.IN_PROGRESS, label: 'In Progress' },
    { value: InterviewStatus.PROCESSED, label: 'Processed' },
    { value: InterviewStatus.TAKEN, label: 'Taken' },
  ];

  constructor(
    private interviewsFacade: InterviewsFacade,
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private store: Store,
  ) {
    this.interviews$ = this.interviewsFacade.interviews$;
    this.loading$ = this.interviewsFacade.loading$;
    this.error$ = this.interviewsFacade.error$;
    this.count$ = this.interviewsFacade.count$;
  }

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.interviewsFacade.loadInterviews();
  }

  // Status filter
  onStatusFilterChange(status: string): void {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
    this.loadInterviews();
  }

  // Interview actions
  onNewInterview(): void {
    // Navigate to new interview page or open modal
    console.log('Create new interview');
    const currentUrl = this.router.url;
    console.log('Current URL:', currentUrl);
    this.router.navigate([currentUrl, 'create-interview']);
  }

  onViewInterview(interview: InterviewEntity): void {
    console.log('View interview:', interview);
    const agentId = this.route.snapshot.params['id'];

    if (!agentId) {
      console.error('Agent ID not found in route parameters');
      return;
    }
    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/');
    const lang = urlSegments[1] || 'en';
    this.router.navigate([
      `/${lang}/agents/agent/${agentId}/interview-details/${interview.id}`,
    ]);
  }

  onShareInterview(interview: InterviewEntity): void {
    this.store.dispatch(
      InterviewsActions.shareInterview({ interviewId: interview.id })
    );
    console.log('share interview:', interview);

    // // Get the current agent ID from the route
    // const agentId = this.route.snapshot.params['id'];

    // if (!agentId) {
    //   console.error('Agent ID not found in route parameters');
    //   return;
    // }

    // console.log('Agent ID:', agentId);
    // console.log('Interview ID:', interview.id);

    // // Step 1: Get the share token for the interview
    // this.interviewShareService
    //   .getShareToken(interview.id)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({
    //     next: (token: string) => {
    //       console.log('Share token received:', token);

    //       // Navigate to start-interview-page with the token
    //       const currentUrl = this.router.url;
    //       const urlSegments = currentUrl.split('/');
    //       const lang = urlSegments[1] || 'en';

    //       this.router.navigate(
    //         [`/${lang}/agents/agent/${agentId}/StartInterview`],
    //         {
    //           queryParams: { token: token },
    //         }
    //       );
    //     },
    //     error: (error) => {
    //       console.error('Error getting share token:', error);
    //       // Handle error - maybe show a toast notification
    //     },
    //   });
  }

  onPlayInterview(interview: InterviewEntity): void {
    console.log('Share interview:', interview);
  }

  onDeleteInterview(interview: InterviewEntity): void {
    if (confirm('Are you sure you want to delete this interview?')) {
      this.interviewsFacade.deleteInterview(interview.id);
    }
  }

  onViewJob(interview: InterviewEntity, event: Event): void {
    event.preventDefault();
    console.log('View job details:', interview.jobTitle);
  }

  // Pagination methods remain the same...
  onPageClick(page: number): void {
    this.currentPage.set(page);
    this.loadInterviews();
  }

  onPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadInterviews();
    }
  }

  onNextPage(): void {
    if (this.currentPage() < this.getTotalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadInterviews();
    }
  }

  getTotalPages(): number {
    // This should come from your facade/service
    return Math.ceil(100 / this.pageSize()); // Placeholder - replace with actual count
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage();
    const pages: number[] = [];

    // Show up to 5 page numbers around current page
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Utility methods remain the same...
  trackByInterviewId(index: number, interview: InterviewEntity): string {
    return interview.id;
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  getStatusClass(status: InterviewStatus): string {
    const statusClasses: { [key in InterviewStatus]: string } = {
      [InterviewStatus.SCHEDULED]: 'scheduled',
      [InterviewStatus.IN_PROGRESS]: 'in-progress',
      [InterviewStatus.PROCESSED]: 'processed',
      [InterviewStatus.TAKEN]: 'taken',
    };
    return statusClasses[status] || 'scheduled';
  }

  getStatusDisplayText(status: InterviewStatus): string {
    const statusTexts: { [key in InterviewStatus]: string } = {
      [InterviewStatus.SCHEDULED]: 'Scheduled',
      [InterviewStatus.IN_PROGRESS]: 'In Progress',
      [InterviewStatus.PROCESSED]: 'Processed',
      [InterviewStatus.TAKEN]: 'Taken',
    };
    return statusTexts[status] || status;
  }
}
