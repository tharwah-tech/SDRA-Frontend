import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiError } from '../../../core/models/api-error.model';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

export interface NotificationCardData {
  type: 'success' | 'info' | 'error';
  title?: string;
  description?: string;
  error?: ApiError;
  // No action string needed here as close is handled by toastr
}

@Component({
  selector: 'app-notification-card',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      transition(
        'inactive <=> active',
        animate('400ms ease-out', style({ opacity: 1 }))
      ),
      state('active', style({ opacity: 1 })),
      transition(
        'active => removed',
        animate('400ms ease-out', style({ opacity: 0 }))
      ),
    ]),
  ],
})
export class NotificationCardComponent extends Toast implements OnInit {
  // Data will be set externally by the showSnackbar utility
  public notificationData!: NotificationCardData;

  constructor(
    protected override toastrService: ToastrService, // Use 'override' if your base class has this property
    public override toastPackage: ToastPackage // Access to toast configuration and data
  ) {
    super(toastrService, toastPackage);
  }

  ngOnInit(): void {
    // Data is now expected to be set before ngOnInit or via @Input if preferred
    // For simplicity with direct property setting, we assume it will be populated.
  }

  // action is a method from Toast base class to handle click actions
  // We can use it to close the toast, or define other actions.
  close(): void {
    // Directly remove the toast using the ToastrService and the toast's ID
    this.toastrService.remove(this.toastPackage.toastId);
  }

  // Helper to access error properties safely in the template
  get errorTitle(): string | undefined {
    return this.notificationData.type === 'error'
      ? this.notificationData.error?.message
      : undefined;
  }

  get errorMessages(): string[] | undefined {
    return this.notificationData.type === 'error' &&
      this.notificationData.error?.errors?.length
      ? this.notificationData.error.errors
      : undefined;
  }
}
