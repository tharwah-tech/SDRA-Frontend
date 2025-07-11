import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { SideNavTabs } from '../../../core/enums/side-nave-tabs.enum';
import { HomePageSidenavComponent } from '../home-page-sidenav/home-page-sidenav.component';
import {
  PageNavigationRoutesComponent,
  routeLink,
} from '../page-navigation-routes/page-navigation-routes.component';
import { User } from '../../../features/authentication/domain/entities/auth-user.entity';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { selectCurrentUser } from '../../../features/authentication/presentation/store/auth.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-main-page-structure',
  imports: [CommonModule, TranslateModule, HomePageSidenavComponent, PageNavigationRoutesComponent],
  templateUrl: './main-page-structure.component.html',
  styleUrl: './main-page-structure.component.scss',
})
export class MainPageStructureComponent implements OnInit {
  isMobileSidenavOpen : boolean = false;
  toggleSidenav() {
    this.isMobileSidenavOpen = !this.isMobileSidenavOpen;
  }
  routesLinks = input.required<routeLink[]>();
  currentActiveTab = input.required<SideNavTabs>();
  currentUser$!: Observable<User | undefined>;
  currentUser!: User;
  constructor(private destroyRef: DestroyRef, private store: Store) {
    this.currentUser$ = this.store.select(selectCurrentUser);
  }
  ngOnInit(): void {
    this.currentUser$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        // filter((user) => !!user),
        tap((user) => {
          if (!user) {
            this.currentUser = {
              id:                '0',
              email:             'Ahmed.Magdi@Tharwah.net',
              first_name:        'Bojy',
              last_name:         'Ahmed',
              full_name:         'Ahmed Magdi',
              organization:      'Tharwah',
              organization_name: 'Tharwah',
              department:        null,
              status:            'active',
              date_joined:       new Date(),
            };
            return;
          }
          this.currentUser = user;
        })
      )
      .subscribe();
  }
}
