import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface LogoutDialogData {
  userFirstName: string;
}

@Component({
  selector: 'app-logout-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './logout-confirmation-dialog.component.html',
  styleUrls: ['./logout-confirmation-dialog.component.scss'],
})
export class LogoutConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LogoutDialogData
  ) {}

  /**
   * Get user initials from first name
   */
  getUserInitials(): string {
    if (!this.data.userFirstName) return 'U';
    return this.data.userFirstName.charAt(0).toUpperCase();
  }

  /**
   * Handle dialog cancellation
   */
  onCancel(): void {
    this.dialogRef.close('cancel');
  }

  /**
   * Handle logout confirmation
   */
  onConfirm(): void {
    this.dialogRef.close('confirm');
  }
}