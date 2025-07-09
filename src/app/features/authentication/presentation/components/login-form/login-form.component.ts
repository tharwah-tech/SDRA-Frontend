import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { Credentials } from '../../../domain/entities/credentials.entity';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { strongPasswordValidation } from '../../../../../shared/utils/strong-password-validation.util';
import { selectAuthLoading } from '../../store/auth.selectors';
import { AuthActions } from '../../store/auth.actions';
import { MatCardModule } from '@angular/material/card';

type loginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-login-form',
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
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
loading$: Observable<boolean>;
  form: loginForm;
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

  login() {
    if (this.form.valid) {
      const val = this.form.value;
      this.credentials = {
        email: val.email!,
        userName: null, // UserName is not used in login, but can be added if needed
        password: val.password!,
      };
      console.log(this.credentials);
      // this.formSubmit.emit(this.credentials);
      this.store.dispatch(AuthActions.login({ credentials: this.credentials }));
    } else {
      this.form.markAllAsTouched();
    }
  }
  forgetPassword() {
    this.form.reset();
    this.router.navigate(['/']);
  }

}
