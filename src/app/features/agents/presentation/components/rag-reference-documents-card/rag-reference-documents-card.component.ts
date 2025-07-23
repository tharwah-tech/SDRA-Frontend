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
  selectRagDocumentUploading,
  selectRagError,
  selectRagLoading,
} from '../../store/rags/rag.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocumentEntity } from '../../../domain/entities/document.enttity';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginationMetadata } from '../../../../../core/entities/paginator.entity';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { UploadDocumentDialogComponent } from '../upload-document-dialog/upload-document-dialog.component';

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
    MatProgressBarModule,
    MatDialogModule,
    MatDividerModule,
  ],
  templateUrl: './rag-reference-documents-card.component.html',
  styleUrl: './rag-reference-documents-card.component.scss',
})
export class RAGReferenceDocumentsCardComponent implements OnInit {
  agentId = input.required<string>();
  error$: Observable<ApiError | null>;
  loading$: Observable<boolean>;
  documentUploading$: Observable<boolean>;
  documents$: Observable<DocumentEntity[]>;
  pagination$: Observable<PaginationMetadata | null>;
  documentsList: DocumentEntity[] = [];

  // Table properties
  displayedColumns: string[] = [
    'filename',
    'type',
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
    private store: Store,
    private dialog: MatDialog
  ) {
    this.error$ = this.store.select(selectRagError);
    this.loading$ = this.store.select(selectRagLoading);
    this.documentUploading$ = this.store.select(selectRagDocumentUploading);
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
          // Update totalItems if no pagination data is available
          if (this.totalItems === 0) {
            this.totalItems = documents.length;
          }
        })
      )
      .subscribe();

    this.documentUploading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((uploading) => {
        // This subscription is no longer needed as upload logic is removed
      });

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
          // If no pagination data, set totalItems based on current documents list
          this.totalItems = this.documentsList.length;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadDocuments();
  }

  onSortChange(sort: Sort): void {
    // Implement sorting logic here if needed
    console.log('Sort:', sort);
  }

  uploadDocument(): void {
    const dialogRef = this.dialog.open(UploadDocumentDialogComponent, {
      width: '400px',
      data: { agentId: this.agentId() },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadDocuments();
      }
    });
  }

  deleteDocument(documentId: string) {
    console.log('deleteDocument:', documentId);
    // Implement delete logic here
  }

  viewDocument(documentId: string) {
    console.log('viewDocument:', documentId);
    // Implement view logic here
  }

  getStatusColor(status: string | undefined | null): string {
    if (!status) {
      return 'primary';
    }

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

  getFileIcon(fileType: string | undefined | null): string {
    if (!fileType) {
      return 'insert_drive_file';
    }

    switch (fileType.toLowerCase()) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'txt':
        return 'article';
      case 'rtf':
        return 'text_fields';
      case 'md':
        return 'code';
      default:
        return 'insert_drive_file';
    }
  }
}
