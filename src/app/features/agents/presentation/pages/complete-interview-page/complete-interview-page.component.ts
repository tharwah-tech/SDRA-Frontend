import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';
import { InterviewsFacade } from '../../facades/interviews.facade';
import { AgentsFacade } from '../../facades/agents.facade';
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { selectIsLoggedIn } from '../../../../authentication/presentation/store/auth.selectors';

@Component({
  selector: 'app-complete-interview-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: './complete-interview-page.component.html',
  styleUrl: './complete-interview-page.component.scss',
})
export class CompleteInterviewPageComponent implements OnInit {
  SideNavTabs = SideNavTabs;

  // Input signals for route parameters
  lang = input.required<string>();

  // Component state
  token: string | null = null;
  completionDate: string | null = null;

  constructor(
    private agentsFacade: AgentsFacade,
    private interviewsFacade: InterviewsFacade,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.parseQueryParameters();
  }

  private parseQueryParameters(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.token = params.get('token');
        this.completionDate = params.get('completed_on');

        // Reload interview if interviewId is available
        if (this.token) {
          // this.interviewsFacade.loadInterview(this.token);
        }
      });
  }

  exitInterview(): void {
    console.log('exitInterview');
    this.store.select(selectIsLoggedIn).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((loggedIn) => {
        console.log('loggedIn', loggedIn);
        if (loggedIn) {
          this.router.navigate([`/${this.lang()}/agents`]);
        }else{
          this.router.navigate([`/${this.lang()}/auth/login`]);
        }
      })
    ).subscribe();
  }

  getFormattedDate(): string {
    if (this.completionDate) {
      return new Date(this.completionDate).toLocaleDateString();
    }
    return new Date().toLocaleDateString();
  }
}
