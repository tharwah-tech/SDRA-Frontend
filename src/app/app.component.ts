import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatCard} from '@angular/material/card';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {LanguageService} from './core/services/language.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule,RouterOutlet, MatButtonModule, MatToolbarModule, MatCard, TranslateModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sdra-frontend';
  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,){}
}
