import { Component, OnInit, signal, computed, DestroyRef, ViewChild, AfterViewInit } from '@angular/core';
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
    this.setupDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configure custom sort accessor
    this.dataSource.sortingDataAccessor = (data: InterviewEntity, sortHeaderId: string) => {
      switch (sortHeaderId) {
        case 'candidateName': return data.candidateName.toLowerCase();
        case 'jobTitle': return data.jobTitle.toLowerCase();
        case 'date': return new Date(data.creationDate).getTime();
        case 'status': return data.status;
        default: return '';
      }
    };
  }

  private setupDataSource(): void {
    // Subscribe to interviews and update data source
    combineLatest([
      this.interviews$,
      this.count$
    ]).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(([interviews, count]) => {
      this.dataSource.data = interviews || [];
      this.totalItems = count || 0;
      
      // Apply status filter
      this.applyStatusFilter();
    });
  }

  private applyStatusFilter(): void {
    const status = this.selectedStatus();
    if (status === 'all') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filterPredicate = (data: InterviewEntity, filter: string) => {
        return data.status === filter;
      };
      this.dataSource.filter = status;
    }
  }

  // Data loading
  loadInterviews(): void {
    this.interviewsFacade.loadInterviews();
  }

  // Status filter handling
  onStatusFilterChange(status: string): void {
    this.selectedStatus.set(status);
    this.applyStatusFilter();
    
    // Reset pagination when filter changes
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  // Pagination handling
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadInterviews();
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
    return this.hasInterviews && this.totalItems > this.pageSize;
  }
}