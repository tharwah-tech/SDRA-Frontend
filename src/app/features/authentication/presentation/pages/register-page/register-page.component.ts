import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../../../../core/services/language.service';
import { CommonModule } from '@angular/common';
import { RegistrationEntity } from '../../../domain/entities/registration.entity';
import { AuthActions } from '../../store/auth.actions';
import { filter, Observable, tap } from 'rxjs';
import { ApiError } from '../../../../../core/models/api-error.model';
import { selectAuthError } from '../../store/auth.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, TranslateModule, RegisterFormComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit {
  lang = input.required<string>();
  error$: Observable<ApiError | null>;
  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,
    private destroyRef: DestroyRef,
    private toastr: ToastrService,
    private router: Router,
    private store: Store
  ) {
    this.error$ = this.store.select(selectAuthError);
  }
  ngOnInit() {
    this.error$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((val) => !!val),
        tap((error) => {
          showSnackbar(this.toastr, { error, type: 'error' });
        })
      )
      .subscribe();
  }
  register(credentials: RegistrationEntity) {
    this.store.dispatch(AuthActions.register({ credentials }));
  }
  goToLogin() {
    this.router.navigate([`${this.lang()}/auth/login`]);
  }
}
