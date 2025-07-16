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
  selectRagDocumentsList,
  selectRagDocumentsPagination,
  selectRagError,
  selectRagLoading,
} from '../../store/rags/rag.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RagDocumentEntity } from '../../../domain/entities/rag-document.enttity';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginatedEntity } from '../../../../../core/entities/paginated.entity';

@Component({
  selector: 'app-rag-reference-documents-card',
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
  ],
  templateUrl: './rag-reference-documents-card.component.html',
  styleUrl: './rag-reference-documents-card.component.scss',
})
export class RAGReferenceDocumentsCardComponent implements OnInit {
  agentId = input.required<string>();
  error$: Observable<ApiError | null>;
  loading$: Observable<boolean>;
  documents$: Observable<RagDocumentEntity[]>;
  pagination$: Observable<PaginatedEntity<RagDocumentEntity> | null>;
  documentsList: RagDocumentEntity[] = [];

  // Table properties
  displayedColumns: string[] = ['filename', 'type', 'status', 'uploadDate', 'actions'];
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];
  currentPage = 1;
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
    this.documents$ = this.store.select(selectRagDocumentsList);
    this.pagination$ = this.store.select(selectRagDocumentsPagination);
  }

  ngOnInit(): void {
    this.loadDocuments();
    this.setupPaginationSubscription();
  }

  loadDocuments(): void {
    this.store.dispatch(
      RagsActions.loadRagDocuments({
        agentId: this.agentId(),
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
      })
    );

    this.documents$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((documents) => documents.length > 0),
        tap((documents) => {
          this.documentsList = documents;
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
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadDocuments();
  }

  onSortChange(sort: Sort): void {
    // Implement sorting logic here if needed
    console.log('Sort:', sort);
  }

  uploadDocument() {
    console.log('uploadDocument');
  }

  deleteDocument(documentId: string) {
    console.log('deleteDocument:', documentId);
    // Implement delete logic here
  }

  viewDocument(documentId: string) {
    console.log('viewDocument:', documentId);
    // Implement view logic here
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'accent';
      case 'processing':
        return 'warn';
      case 'failed':
        return 'error';
      default:
        return 'primary';
    }
  }
}
