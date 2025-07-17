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
import { filter, Observable, tap, take } from 'rxjs';
import {
  selectRagDocumentsList,
  selectRagDocumentsPagination,
  selectRagError,
  selectRagLoading,
  selectRagConversationSummaryList,
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
  converstions$: Observable<RagConversationSummaryEntity[]>;
  pagination$: Observable<PaginationMetadata | null>;
  converstionsList: RagConversationSummaryEntity[] = [];

  // Table properties
  displayedColumns: string[] = [
    'filename',
    'type',
    'status',
    'uploadDate',
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
    this.converstions$ = this.store.select(selectRagConversationSummaryList);
    this.pagination$ = this.store.select(selectRagDocumentsPagination);
  }

  ngOnInit(): void {
    this.loadConversations();
    this.setupPaginationSubscription();
    this.converstions$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((converstions) => {
        this.converstionsList = converstions;
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

  loadConversations(): void {
    this.store.dispatch(
      RagsActions.loadRagConversationsSummaries({
        agentId: this.agentId(),
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
      })
    );
  }

  setupPaginationSubscription(): void {
    this.pagination$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pagination) => {
        if (pagination) {
          this.totalItems = pagination.totalCount;
        } else {
          // If no pagination data, set totalItems based on current documents list
          this.totalItems = this.converstionsList.length;
        }
      });
  }
}
