import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { strongPasswordValidation } from '../../../../../shared/utils/strong-password-validation.util';
import { Credentials } from '../../../domain/entities/credentials.entity';
import { selectAuthLoading } from '../../store/auth.selectors';

type registrationForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  organization: FormControl<string>;
}>;

@Component({
  selector: 'app-register-form',
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  @Output() navigateToLogin = new EventEmitter<void>();
  loading$: Observable<boolean>;
  form: registrationForm;
  credentials!: Credentials;
  hidePassword: boolean = true;

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private store: Store
  ) {
    this.loading$ = this.store.select(selectAuthLoading);
    this.form = fb.group({
      email: fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      password: fb.control('', {
        validators: [
          Validators.required,
          Validators.minLength(6),
          strongPasswordValidation,
        ],
      }),
      confirmPassword: fb.control('', {
        validators: [
          Validators.required,
          Validators.minLength(6),
          strongPasswordValidation,
        ],
      }),
      firstName: fb.control('', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      lastName: fb.control('', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
      organization: fb.control('', {
        validators: [Validators.required, Validators.minLength(2)],
      }),
    });
  }

  ngOnInit() {}
  get emailControl() {
    return this.form.controls.email;
  }

  get emailRequired() {
    return this.emailControl?.hasError('required');
  }

  get validEmail() {
    return (
      this.emailControl?.value &&
      (this.emailControl?.touched || this.emailControl?.dirty) &&
      this.emailControl?.hasError('email')
    );
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  get passwordRequired() {
    return (
      (this.passwordControl?.touched || this.passwordControl?.dirty) &&
      this.passwordControl?.hasError('required')
    );
  }

  get passwordMinLengthError() {
    return (
      this.passwordControl?.value &&
      (this.passwordControl?.touched || this.passwordControl?.dirty) &&
      this.passwordControl?.hasError('minlength')
    );
  }

  get passwordWeakError() {
    return (
      this.passwordControl?.value &&
      (this.passwordControl?.touched || this.passwordControl?.dirty) &&
      this.passwordControl?.hasError('weakPassword')
    );
  }

  get passwordSpecialCharError() {
    return (
      this.passwordControl?.value &&
      (this.passwordControl?.touched || this.passwordControl?.dirty) &&
      this.passwordControl?.hasError('doesNotContainSpecialChar')
    );
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  get confirmPasswordControl() {
    return this.form.controls.confirmPassword;
  }
  get confirmPasswordRequired() {
    return (
      (this.confirmPasswordControl?.touched || this.confirmPasswordControl?.dirty) &&
      this.confirmPasswordControl?.hasError('required')
    );
  }
  get confirmPasswordMinLengthError() {
    return (
      this.confirmPasswordControl?.value &&
      (this.confirmPasswordControl?.touched || this.confirmPasswordControl?.dirty) &&
      this.confirmPasswordControl?.hasError('minlength')
    );
  }
  get confirmPasswordWeakError() {
    return (
      this.confirmPasswordControl?.value &&
      (this.confirmPasswordControl?.touched || this.confirmPasswordControl?.dirty) &&
      this.confirmPasswordControl?.hasError('weakPassword')
    );
  }
  get confirmPasswordSpecialCharError() {
    return (
      this.confirmPasswordControl?.value &&
      (this.confirmPasswordControl?.touched || this.confirmPasswordControl?.dirty) &&
      this.confirmPasswordControl?.hasError('doesNotContainSpecialChar')
    );
  }
  get confirmPasswordMismatchError() {
    return (
      this.confirmPasswordControl?.value &&
      (this.confirmPasswordControl?.touched || this.confirmPasswordControl?.dirty) &&
      this.confirmPasswordControl?.hasError('passwordMismatch')
    );
  }
  get firstNameControl() {
    return this.form.controls.firstName;
  }
  get firstNameRequired() {
    return (
      (this.firstNameControl?.touched || this.firstNameControl?.dirty) &&
      this.firstNameControl?.hasError('required')
    );
  }
  get firstNameMinLengthError() {
    return (
      this.firstNameControl?.value &&
      (this.firstNameControl?.touched || this.firstNameControl?.dirty) &&
      this.firstNameControl?.hasError('minlength')
    );
  }
  get lastNameControl() {
    return this.form.controls.lastName;
  }
  get lastNameRequired() {
    return (
      (this.lastNameControl?.touched || this.lastNameControl?.dirty) &&
      this.lastNameControl?.hasError('required')
    );
  }
  get lastNameMinLengthError() {
    return (
      this.lastNameControl?.value &&
      (this.lastNameControl?.touched || this.lastNameControl?.dirty) &&
      this.lastNameControl?.hasError('minlength')
    );
  }
  get organizationControl() {
    return this.form.controls.organization;
  }
  get organizationRequired() {
    return (
      (this.organizationControl?.touched || this.organizationControl?.dirty) &&
      this.organizationControl?.hasError('required')
    );
  }
  get organizationMinLengthError() {
    return (
      this.organizationControl?.value &&
      (this.organizationControl?.touched || this.organizationControl?.dirty) &&
      this.organizationControl?.hasError('minlength')
    );
  }
  get formValid() {
    return this.form.valid;
  }

  register(){}
  goToLogin() {
    this.form.reset();
    this.navigateToLogin.emit();
  }
}
