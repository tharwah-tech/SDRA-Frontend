import { Component, DestroyRef, input } from '@angular/core';
import { RegisterFormComponent } from "../../components/register-form/register-form.component";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../../../../core/services/language.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, TranslateModule, RegisterFormComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  lang = input.required<string>();
  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,
    private destroyRef: DestroyRef,
    private toastr: ToastrService,
    private router: Router,
    private store: Store
  ) {}
 goToLogin() {
   this.router.navigate([`${this.lang()}/auth/login`]);
  }
}
