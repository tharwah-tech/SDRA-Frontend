import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from './core/services/language.service';
import { TokenExpirationService } from './features/authentication/data/services/token-expiration.service';
import { AuthActions } from './features/authentication/presentation/store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'sdra-AI';

  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,
    private tokenExpirationService: TokenExpirationService,
    private store: Store
  ) {}
  ngOnInit() {
    this.store.dispatch(AuthActions.getCurrentUser());
    // this.tokenExpirationService.initExpirationMonitor();
  }
}
