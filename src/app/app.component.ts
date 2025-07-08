import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {LanguageService} from './core/services/language.service';
import { TokenExpirationService } from './features/authentication/data/services/token-expiration.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, TranslateModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'sdra-frontend';

  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,
  private tokenExpirationService: TokenExpirationService) {
  }
  ngOnInit() {
    // This will start monitoring token expiration
    console.log('main component ngOnInit started...');

    this.tokenExpirationService.initExpirationMonitor();
  }
}
