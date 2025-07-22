import { Component, Inject, inject, DestroyRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RagsActions } from '../../store/rags/rag.actions';
import { ApiError } from '../../../../../core/models/api-error.model';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';
import { filter, take } from 'rxjs';
import { selectRagError } from '../../store/rags/rag.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-upload-document-dialog',
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './upload-document-dialog.component.html',
  styleUrl: './upload-document-dialog.component.scss',
  standalone: true,
})
export class UploadDocumentDialogComponent {
  isUploading = false;
  uploadProgress = 0;
  selectedFile: File | null = null;
  private destroyRef = inject(DestroyRef);

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<UploadDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { agentId: string }
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
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
  }

  startUpload(): void {
    if (!this.selectedFile) return;
    this.isUploading = true;
    this.uploadProgress = 0;
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += Math.random() * 10;
      }
    }, 200);
    // Dispatch upload action
    this.store.dispatch(
      RagsActions.uploadRagDocument({
        agentId: this.data.agentId,
        file: this.selectedFile,
      })
    );
    // Listen for upload error
    this.store
      .select(selectRagError)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((error) => error !== null)
      )
      .subscribe(() => {
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
        take(1)
      )
      .subscribe(() => {
        clearInterval(progressInterval);
        this.uploadProgress = 100;
        setTimeout(() => {
          this.isUploading = false;
          this.uploadProgress = 0;
          this.selectedFile = null;
          this.dialogRef.close(true); // Indicate upload success
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

  onClose(): void {
    this.dialogRef.close(false);
  }
}
