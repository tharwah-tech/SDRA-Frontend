import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../../../../core/services/language.service';
import { Store } from '@ngrx/store';
import { filter, Observable, tap } from 'rxjs';
import { ApiError } from '../../../../../core/models/api-error.model';
import { selectAuthError } from '../../store/auth.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, TranslateModule, LoginFormComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
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
  goToRegister() {
    this.router.navigate([`${this.lang()}/auth/register`]);
  }
}
