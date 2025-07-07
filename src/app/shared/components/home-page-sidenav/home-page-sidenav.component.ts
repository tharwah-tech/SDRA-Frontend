import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, signal } from '@angular/core';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SideNavTabs } from '../../../core/enums/side-nave-tabs.enum';
import { Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-home-page-sidenav',
  imports: [CommonModule, TranslateModule],
  templateUrl: './home-page-sidenav.component.html',
  styleUrl: './home-page-sidenav.component.scss'
})
export class HomePageSidenavComponent {
SideNavTabs = SideNavTabs;
  currentActiveTab = input<SideNavTabs>(SideNavTabs.AI_Agents);
  currentLangCode = signal<string | undefined>(undefined);
  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.currentLangCode.set(this.languageService.getLanguage());
  }
  ngOnInit(): void {
    const langChangeSubscription = this.translateService.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.currentLangCode.set(this.languageService.getLanguage());
      }
    );
    this.destroyRef.onDestroy(() => {
      langChangeSubscription.unsubscribe();
    });
  }
  navigateTo(tab: SideNavTabs): void {}
}
