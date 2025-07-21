import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, signal } from '@angular/core';
import {
  LangChangeEvent,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SideNavTabs } from '../../../core/enums/side-nave-tabs.enum';
import { Router } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { SidnaveItemComponent } from "./sidnave-item/sidnave-item.component";
import { User } from '../../../features/authentication/domain/entities/auth-user.entity';
import { AuthActions } from '../../../features/authentication/presentation/store/auth.actions';
import { selectAuthLoading } from '../../../features/authentication/presentation/store/auth.selectors';
import { LogoutConfirmationDialogComponent } from '../logout-confirmation-dialog/logout-confirmation-dialog/logout-confirmation-dialog.component';

@Component({
  selector: 'app-home-page-sidenav',
  imports: [
    CommonModule, 
    TranslateModule, 
    SidnaveItemComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home-page-sidenav.component.html',
  styleUrl: './home-page-sidenav.component.scss',
})
export class HomePageSidenavComponent {
  SideNavTabs = SideNavTabs;
  currentActiveTab = input<SideNavTabs>(SideNavTabs.SYSTEM_AGENTS);
  currentUser = input.required<User>();
  currentLangCode = signal<string | undefined>(undefined);
  
  // Auth loading state for logout button
  isLoggingOut$: Observable<boolean>;

  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,
    private router: Router,
    private destroyRef: DestroyRef,
    private store: Store,
    private dialog: MatDialog
  ) {
    this.currentLangCode.set(this.languageService.getLanguage());
    this.isLoggingOut$ = this.store.select(selectAuthLoading);
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
        return [this.currentLangCode() ?? 'en', 'agents'];
      case SideNavTabs.AI_AGENTS:
        return [this.currentLangCode() ?? 'en', 'ai-agents'];
      case SideNavTabs.GYM:
        return [this.currentLangCode() ?? 'en', 'gym'];
      case SideNavTabs.HOSPITAL:
        return [this.currentLangCode() ?? 'en', 'hospital'];
      case SideNavTabs.GRAVEYARD:
        return [this.currentLangCode() ?? 'en', 'graveyard'];
      case SideNavTabs.SCHOOL:
        return [this.currentLangCode() ?? 'en', 'school'];
      case SideNavTabs.ANALYTICS:
        return [this.currentLangCode() ?? 'en', 'analytics'];
      case SideNavTabs.SETTINGS:
        return [this.currentLangCode() ?? 'en', 'settings'];
      default:
        return [this.currentLangCode() ?? 'en'];
    }
  }

  /**
   * Handle logout with confirmation dialog
   */
  onLogout(): void {
    const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        userFirstName: this.currentUser().first_name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.performLogout();
      }
    });
  }

  /**
   * Dispatch logout action to NgRx store
   */
  private performLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  /**
   * Handle logout without confirmation (for quick logout scenarios)
   */
  onQuickLogout(): void {
    this.performLogout();
  }
}