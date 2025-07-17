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
import { PaginationMetadata } from '../../../../../core/entities/paginator.entity';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

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
  documents$: Observable<RagDocumentEntity[]>;
  pagination$: Observable<PaginationMetadata | null>;
  documentsList: RagDocumentEntity[] = [];

  // Upload properties
  isUploading = false;
  uploadProgress = 0;
  selectedFile: File | null = null;
  fileInput: HTMLInputElement | null = null;

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
    // Create a hidden file input if it doesn't exist
    if (!this.fileInput) {
      this.fileInput = document.createElement('input');
      this.fileInput.type = 'file';
      this.fileInput.accept = '.pdf,.doc,.docx,.txt,.rtf,.md';
      this.fileInput.style.display = 'none';
      document.body.appendChild(this.fileInput);

      this.fileInput.addEventListener('change', (event: any) => {
        const file = event.target.files[0];
        if (file) {
          this.handleFileSelection(file);
        }
      });
    }

    this.fileInput.click();
  }

  handleFileSelection(file: File): void {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showSnackbar(this.toastr, {
        type: 'error',
        error: { message: 'File size exceeds 10MB limit' } as ApiError,
      });
      return;
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/rtf',
      'text/markdown',
    ];

    if (!allowedTypes.includes(file.type)) {
      showSnackbar(this.toastr, {
        type: 'error',
        error: {
          message:
            'Invalid file type. Please upload PDF, DOC, DOCX, TXT, RTF, or MD files only.',
        } as ApiError,
      });
      return;
    }

    this.selectedFile = file;
    this.startUpload();
  }

  startUpload(): void {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    // Simulate upload progress (in real implementation, you'd track actual progress)
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += Math.random() * 10;
      }
    }, 200);

    // Dispatch upload action
    this.store.dispatch(
      RagsActions.uploadRagDocument({
        agentId: this.agentId(),
        file: this.selectedFile,
      })
    );

    // Listen for upload error
    this.error$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((error) => error !== null)
      )
      .subscribe((error) => {
        clearInterval(progressInterval);
        this.uploadProgress = 0;
        this.isUploading = false;
        this.selectedFile = null;
      });

    // Listen for successful upload completion
    this.store
      .select((state: any) => state.rags)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((state) => state && state.documentsList && this.isUploading),
        take(1) // Only take the first emission to prevent infinite loop
      )
      .subscribe(() => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        setTimeout(() => {
          this.isUploading = false;
          this.uploadProgress = 0;
          this.selectedFile = null;
          // Reload documents to get fresh data from server
          this.loadDocuments();
        }, 500);
      });
  }

  cancelUpload(): void {
    this.isUploading = false;
    this.uploadProgress = 0;
    this.selectedFile = null;
    showSnackbar(this.toastr, {
      type: 'info',
      title: 'Info',
      description: 'Upload cancelled',
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
