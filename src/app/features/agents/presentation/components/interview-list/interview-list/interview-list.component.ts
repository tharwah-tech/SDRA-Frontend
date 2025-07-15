import { Component, OnInit, signal, computed, DestroyRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, Observable, tap, map, combineLatest } from 'rxjs';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';

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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.scss'],
})
export class InterviewListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Component state
  selectedStatus = signal('all');
  
  // Data storage
  private allInterviews: InterviewEntity[] = [];
  private filteredInterviews: InterviewEntity[] = [];
  private dataLoaded = false; // Track if data has been loaded
  
  // Mat Table configuration
  displayedColumns: string[] = ['candidateName', 'jobTitle', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<InterviewEntity>([]);
  
  // Observables
  interviews$: Observable<InterviewEntity[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  count$: Observable<number>;
  
  // Pagination properties
  totalItems = 0;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15, 20];

  // Status filter options
  statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: InterviewStatus.SCHEDULED, label: 'Scheduled' },
    { value: InterviewStatus.IN_PROGRESS, label: 'In Progress' },
    { value: InterviewStatus.PROCESSED, label: 'Processed' },
    { value: InterviewStatus.TAKEN, label: 'Taken' },
  ];

  // Computed properties for pagination
  get paginatedInterviews(): InterviewEntity[] {
    if (!this.filteredInterviews || this.filteredInterviews.length === 0) {
      return [];
    }
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredInterviews.slice(startIndex, endIndex);
  }

  get totalFilteredItems(): number {
    return this.filteredInterviews ? this.filteredInterviews.length : 0;
  }

  constructor(
    private interviewsFacade: InterviewsFacade,
    private router: Router,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef,
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {
    this.interviews$ = this.interviewsFacade.interviews$;
    this.loading$ = this.interviewsFacade.loading$;
    this.error$ = this.interviewsFacade.error$;
    this.count$ = this.interviewsFacade.count$;
  }

  ngOnInit(): void {
    // Initialize state
    this.allInterviews = [];
    this.filteredInterviews = [];
    this.dataLoaded = false;
    
    // Load interviews and setup data source
    this.loadInterviews();
    this.setupDataSource();
  }

  ngAfterViewInit(): void {
    // Don't set paginator and sort on dataSource since we're handling pagination manually
    this.setupCustomSort();
  }

  private setupDataSource(): void {
    // Subscribe to interviews and update data source
    combineLatest([
      this.interviews$,
      this.count$
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([interviews, count]) => {
      // Mark that we've received data from the observable
      this.dataLoaded = true;
      
      // Process the data
      this.processInterviewData(interviews, count);
    });
  }

  private processInterviewData(interviews: InterviewEntity[] | null | undefined, count: number | null | undefined): void {
    if (interviews && Array.isArray(interviews) && interviews.length > 0) {
      this.allInterviews = interviews;
      this.totalItems = count || interviews.length;
      
      // Apply status filter and update pagination
      this.applyStatusFilter();
      this.updatePaginatedData();
      
      // Trigger change detection to ensure UI updates
      this.cdr.detectChanges();
    } else if (interviews && Array.isArray(interviews) && interviews.length === 0) {
      // Handle empty but valid data
      this.allInterviews = [];
      this.filteredInterviews = [];
      this.totalItems = 0;
      this.dataSource.data = [];
      
      // Trigger change detection to ensure UI updates
      this.cdr.detectChanges();
    }
  }

  private setupCustomSort(): void {
    if (this.sort) {
      this.sort.sortChange.pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => {
        this.sortFilteredData();
        this.pageIndex = 0; // Reset to first page when sorting
        this.updatePaginatedData();
      });
    }
  }

  private sortFilteredData(): void {
    // Don't sort if no data or sort is not active
    if (!this.filteredInterviews || this.filteredInterviews.length === 0 || !this.sort?.active || !this.sort?.direction) {
      return;
    }

    this.filteredInterviews = this.filteredInterviews.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      
      switch (this.sort.active) {
        case 'candidateName':
          return this.compare(a.candidateName.toLowerCase(), b.candidateName.toLowerCase(), isAsc);
        case 'jobTitle':
          return this.compare(a.jobTitle.toLowerCase(), b.jobTitle.toLowerCase(), isAsc);
        case 'date':
          return this.compare(new Date(a.creationDate).getTime(), new Date(b.creationDate).getTime(), isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private applyStatusFilter(): void {
    // Ensure we have data to filter
    if (!this.allInterviews || this.allInterviews.length === 0) {
      this.filteredInterviews = [];
      return;
    }

    const status = this.selectedStatus();
    if (status === 'all') {
      this.filteredInterviews = [...this.allInterviews];
    } else {
      this.filteredInterviews = this.allInterviews.filter(interview => interview.status === status);
    }
    
    // Apply current sorting after filtering
    this.sortFilteredData();
  }

  private updatePaginatedData(): void {
    // Ensure we have filtered data
    if (!this.filteredInterviews || this.filteredInterviews.length === 0) {
      this.dataSource.data = [];
      return;
    }

    // Check if current page index is valid
    const maxPageIndex = Math.ceil(this.filteredInterviews.length / this.pageSize) - 1;
    if (this.pageIndex > maxPageIndex) {
      this.pageIndex = Math.max(0, maxPageIndex);
    }

    // Calculate paginated data
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paginatedData = this.filteredInterviews.slice(startIndex, endIndex);
    
    // Update the data source
    this.dataSource.data = paginatedData;
  }

  // Data loading
  loadInterviews(): void {
    this.interviewsFacade.loadInterviews();
  }

  // Status filter handling
  onStatusFilterChange(status: string): void {
    this.selectedStatus.set(status);
    this.pageIndex = 0; // Reset to first page when filter changes
    this.applyStatusFilter();
    this.updatePaginatedData();
  }

  // Pagination handling
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  // Interview action methods
  onNewInterview(): void {
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
    console.log('Share interview:', interview);
  }

  onPlayInterview(interview: InterviewEntity): void {
    console.log('Play interview:', interview);
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

  // Utility methods
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

  // Computed properties for template
  get hasInterviews(): boolean {
    return this.dataSource.data.length > 0;
  }

  get showPaginator(): boolean {
    return this.totalFilteredItems > this.pageSize;
  }

  get hasDataLoaded(): boolean {
    return this.dataLoaded;
  }

  get currentPageInfo(): string {
    if (!this.totalFilteredItems || this.totalFilteredItems === 0) {
      return '0 of 0';
    }
    const startIndex = this.pageIndex * this.pageSize + 1;
    const endIndex = Math.min((this.pageIndex + 1) * this.pageSize, this.totalFilteredItems);
    return `${startIndex}-${endIndex} of ${this.totalFilteredItems}`;
  }
}