
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { filter, tap } from 'rxjs';
import { InterviewEntity, InterviewStatus } from '../../../../domain/entities/interview.entity';
import { InterviewsFacade } from '../../../facades/interviews.facade';

@Component({
  selector: 'app-interview-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    MatPaginatorModule
  ],
  templateUrl: './interview-list.component.html',
  styleUrl: './interview-list.component.scss'
})
export class InterviewListComponent implements OnInit {
  interviews$;
  loading$;
  error$;
  count$;
  pagination$;

  selectedStatus = signal<string>('all');
  currentPage = signal<number>(1); // 1-based for API
  pageSize = signal<number>(10);
  
  readonly InterviewStatus = InterviewStatus;
  readonly statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: InterviewStatus.SCHEDULED, label: 'Scheduled' },
    { value: InterviewStatus.PROCESSED, label: 'Processed' },
    { value: InterviewStatus.IN_PROGRESS, label: 'In Progress' },
    { value: InterviewStatus.TAKEN, label: 'Taken' }
  ];

  constructor(
    private interviewsFacade: InterviewsFacade,
    private destroyRef: DestroyRef
  ) {
    this.interviews$ = this.interviewsFacade.interviews$;
    this.loading$ = this.interviewsFacade.loading$;
    this.error$ = this.interviewsFacade.error$;
    this.count$ = this.interviewsFacade.count$;
    this.pagination$ = this.interviewsFacade.pagination$;
  }

  ngOnInit(): void {
    this.loadInterviews();
    this.setupSubscriptions();
  }

  private setupSubscriptions(): void {
    this.error$
      .pipe(
        filter(error => error !== null),
        takeUntilDestroyed(this.destroyRef),
        tap(error => console.error('Interview loading error:', error))
      )
      .subscribe();
  }

  loadInterviews(): void {
    this.interviewsFacade.loadInterviews();
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus.set(status);
    this.currentPage.set(1); // Reset to first page
    // In a real app, you'd filter server-side
    // For now, we'll use client-side filtering via selectors
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1); // API uses 1-based indexing
    this.pageSize.set(event.pageSize);
    // TODO: Implement server-side pagination with the new API structure
    // You would call: this.interviewsFacade.loadInterviews(page, pageSize)
    console.log('Page changed:', { page: event.pageIndex + 1, pageSize: event.pageSize });
  }

  onNewInterview(): void {
    // Navigate to create new interview page
    console.log('Create new interview');
  }

  onViewInterview(interview: InterviewEntity): void {
    console.log('View interview:', interview.id);
    this.interviewsFacade.setSelectedInterview(interview);
  }

  onPlayInterview(interview: InterviewEntity): void {
    console.log('Play interview:', interview.id);
    // Navigate to interview player/viewer
  }

  onShareInterview(interview: InterviewEntity): void {
    console.log('Share interview:', interview.id);
    // Implement share functionality
  }

  onDeleteInterview(interview: InterviewEntity): void {
    if (confirm(`Are you sure you want to delete the interview with ${interview.candidateName}?`)) {
      this.interviewsFacade.deleteInterview(interview.id);
    }
  }

  onUpdateStatus(interview: InterviewEntity, newStatus: InterviewStatus): void {
    this.interviewsFacade.updateInterviewStatus(interview.id, newStatus);
  }

  getStatusColor(status: InterviewStatus): string {
    switch (status) {
      case InterviewStatus.SCHEDULED:
        return 'text-blue-600 bg-blue-100';
      case InterviewStatus.PROCESSED:
        return 'text-green-600 bg-green-100';
      case InterviewStatus.IN_PROGRESS:
        return 'text-orange-600 bg-orange-100';
      case InterviewStatus.TAKEN:
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusDisplayText(status: InterviewStatus): string {
    switch (status) {
      case InterviewStatus.SCHEDULED:
        return 'Scheduled';
      case InterviewStatus.PROCESSED:
        return 'Processed';
      case InterviewStatus.IN_PROGRESS:
        return 'In Progress';
      case InterviewStatus.TAKEN:
        return 'Taken';
      default:
        return 'Unknown';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  trackByInterviewId(index: number, interview: InterviewEntity): string {
    return interview.id;
  }
}