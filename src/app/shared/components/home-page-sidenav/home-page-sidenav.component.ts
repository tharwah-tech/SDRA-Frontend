import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, signal } from '@angular/core';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { SideNavTabs } from '../../../core/enums/side-nave-tabs.enum';
import { Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { SidnaveItemComponent } from "./sidnave-item/sidnave-item.component";
import { last } from 'rxjs';
import { User } from '../../../features/authentication/domain/entities/auth-user.entity';

@Component({
  selector: 'app-home-page-sidenav',
  imports: [CommonModule, TranslateModule, SidnaveItemComponent],
  templateUrl: './home-page-sidenav.component.html',
  styleUrl: './home-page-sidenav.component.scss',
})
export class HomePageSidenavComponent {
  SideNavTabs = SideNavTabs;
  currentActiveTab = input<SideNavTabs>(SideNavTabs.SYSTEM_AGENTS);
  currentUser = input.required<User>();
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
  getInitials(): string {
    const firstName = this.currentUser().first_name || '';
    const lastName = this.currentUser().last_name || '';
    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    return initials;
  }
   getTabNavigateList(tab: SideNavTabs): string[] {
     switch (tab) {
      case SideNavTabs.SYSTEM_AGENTS:
        return [this.currentLangCode()??'en', 'agents'];
      case SideNavTabs.AI_AGENTS:
        return [this.currentLangCode()??'en', 'ai-agents'];
      case SideNavTabs.GYM:
        return [this.currentLangCode()??'en', 'gym'];
        break;
      case SideNavTabs.HOSPITAL:
        return [this.currentLangCode()??'en', 'hospital'];
      case SideNavTabs.GRAVEYARD:
        return [this.currentLangCode()??'en', 'graveyard'];
      case SideNavTabs.SCHOOL:
        return [this.currentLangCode()??'en', 'school'];
        break;
      case SideNavTabs.ANALYTICS:
        return [this.currentLangCode()??'en', 'analytics'];
      case SideNavTabs.SETTINGS:
        return [this.currentLangCode()??'en', 'settings'];
      default:
        return [this.currentLangCode()??'en'];
    }
  }
}
