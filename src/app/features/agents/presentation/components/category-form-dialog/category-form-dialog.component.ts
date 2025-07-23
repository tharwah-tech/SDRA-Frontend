import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

export interface CategoryFormData {
  categoryName: string;
  emailAddress: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './category-form-dialog.component.html',
  styleUrls: ['./category-form-dialog.component.scss']
})
export class CategoryFormDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryFormDialogComponent>);

  categoryForm: FormGroup = this.fb.group({
    categoryName: ['', [Validators.required, Validators.minLength(2)]],
    emailAddress: ['', [Validators.required, Validators.email]],
    isDefault: [false]
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.categoryForm.valid) {
      const formData: CategoryFormData = this.categoryForm.value;
      this.dialogRef.close(formData);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.categoryForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} must be at least 2 characters long`;
    }
    return '';
  }
}

export function openCategoryDialog(dialog: MatDialog): Observable<CategoryFormData | undefined> {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';
  
  // Center the dialog
  config.position = undefined;
  
  // Add custom panel class for styling
  config.panelClass = 'category-dialog-panel';
  
  // Enable backdrop
  config.hasBackdrop = true;
  config.backdropClass = 'category-dialog-backdrop';

  const dialogRef = dialog.open<
    CategoryFormDialogComponent,
    null,
    CategoryFormData 
  >(CategoryFormDialogComponent, config);

  return dialogRef.afterClosed();
}