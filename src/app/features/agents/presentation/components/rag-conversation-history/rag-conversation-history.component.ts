
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../../../../core/services/language.service';
import { RagsActions } from '../../store/rags/rag.actions';
import { OnInit } from '@angular/core';
import { ApiError } from '../../../../../core/models/api-error.model';
import { filter, Observable, tap } from 'rxjs';
import {
  selectRagConversationSummaryList,
  selectRagConversationsPagination,
  selectRagError,
  selectRagLoading,
} from '../../store/rags/rag.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginationMetadata } from '../../../../../core/entities/paginator.entity';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { RagConversationSummaryEntity } from '../../../domain/entities/rag-conversation-summary.entity';

@Component({
  selector: 'app-rag-conversation-history',
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatDialogModule,
    MatDividerModule,
  ],
  templateUrl: './rag-conversation-history.component.html',
  styleUrl: './rag-conversation-history.component.scss',
})
export class RAGConversationHistoryComponent implements OnInit {
  agentId = input.required<string>();
  error$: Observable<ApiError | null>;
  loading$: Observable<boolean>;
  conversations$: Observable<RagConversationSummaryEntity[]>;
  pagination$: Observable<PaginationMetadata | null>;
  conversationsList: RagConversationSummaryEntity[] = [];

  // Table properties
  displayedColumns: string[] = [
    'title',
    'lastActive',
    'status',
    'actions',
  ];
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 1;
  currentPageIndex = 0; // Material paginator uses 0-based index
  totalItems = 0;

  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,
    private destroyRef: DestroyRef,
    private toastr: ToastrService,
    private router: Router,
    private store: Store
  ) {
    this.error$ = this.store.select(selectRagError);
    this.loading$ = this.store.select(selectRagLoading);
    this.conversations$ = this.store.select(selectRagConversationSummaryList);
    this.pagination$ = this.store.select(selectRagConversationsPagination);
  }

  ngOnInit(): void {
    this.loadConversations();
    this.setupPaginationSubscription();
  }

  loadConversations(): void {
    this.store.dispatch(
      RagsActions.loadRagConversationsSummaries({
        agentId: this.agentId(),
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
      })
    );

    this.conversations$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((conversations) => conversations.length >= 0),
        tap((conversations) => {
          this.conversationsList = conversations;
          // Update totalItems if no pagination data is available
          if (this.totalItems === 0) {
            this.totalItems = conversations.length;
          }
        })
      )
      .subscribe();

    this.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((error) => {
      if (error) {
        showSnackbar(this.toastr, {
          type: 'error',
          error,
        });
      }
    });
  }

  setupPaginationSubscription(): void {
    this.pagination$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pagination) => {
        if (pagination) {
          this.totalItems = pagination.totalCount;
        } else {
          // If no pagination data, set totalItems based on current conversations list
          this.totalItems = this.conversationsList.length;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadConversations();
  }

  onSortChange(sort: Sort): void {
    // Implement sorting logic here if needed
    console.log('Sort:', sort);
  }

  startNewConversation(): void {
    this.store.dispatch(
      RagsActions.startRagConversation({
        agentId: this.agentId(),
      })
    );
  }

  viewConversation(conversationId: string): void {
    // Navigate to conversation details or load conversation
    this.store.dispatch(
      RagsActions.loadRagConversation({
        id: conversationId,
      })
    );
    // You can also navigate to a conversation details page
    // this.router.navigate(['/agents/conversation', conversationId]);
  }

  deleteConversation(conversationId: string): void {
    // Implement delete logic here
    console.log('Delete conversation:', conversationId);
    // You would typically dispatch a delete action
    // this.store.dispatch(RagsActions.deleteRagConversation({ id: conversationId }));
  }

  getStatusColor(status: string | undefined | null): string {
    if (!status) {
      return 'var(--primary-color)';
    }

    switch (status.toLowerCase()) {
      case 'active':
        return 'var(--accent-color)';
      case 'archived':
        return 'var(--accent-color)';
      case 'completed':
        return 'var(--accent-color)';
      default:
        return 'var(--primary-color)';
    }
  }

  getStatusIcon(status: string | undefined | null): string {
    if (!status) {
      return 'chat';
    }

    switch (status.toLowerCase()) {
      case 'active':
        return 'chat';
      case 'archived':
        return 'archive';
      case 'completed':
        return 'check_circle';
      default:
        return 'chat';
    }
  }

  formatLastActive(lastActive: Date | string): string {
    if (!lastActive) {
      return 'Unknown';
    }

    const date = typeof lastActive === 'string' ? new Date(lastActive) : lastActive;
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
}
