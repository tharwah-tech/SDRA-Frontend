import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  input,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MainPageStructureComponent } from '../../../../../shared/components/main-page-structure/main-page-structure.component';
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
import { Store } from '@ngrx/store';
import { LanguageService } from '../../../../../core/services/language.service';
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter, Observable, tap } from 'rxjs';
import { InterviewDetailsEntity } from '../../../domain/entities/interview-details.entity';
import {
  selectInterviewsError,
  selectInterviewsLoading,
  selectSelectedInterview,
} from '../../store/interviews/interviews.selectors';
import { ApiError } from '../../../../../core/models/api-error.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';
import { InterviewsActions } from '../../store/interviews/interviews.actions';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-interview-details-page',
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MainPageStructureComponent,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './view-interview-details-page.component.html',
  styleUrl: './view-interview-details-page.component.scss',
})
export class ViewInterviewDetailsPageComponent
  implements OnInit, AfterViewInit
{
  SideNavTabs = SideNavTabs;
  lang = input.required<string>();
  id = input.required<string>();
  interviewId = input.required<string>();
  interviewDetails$: Observable<InterviewDetailsEntity | null>;
  interviewDetails: InterviewDetailsEntity | null = null;
  loading$: Observable<boolean>;
  errors: Observable<ApiError | null>;
  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,
    private destroyRef: DestroyRef,
    private toastr: ToastrService,
    private router: Router,
    private store: Store
  ) {
    this.interviewDetails$ = this.store.select(selectSelectedInterview);
    this.loading$ = this.store.select(selectInterviewsLoading);
    this.errors = this.store.select(selectInterviewsError);
  }

  ngOnInit(): void {
    this.interviewDetails$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((interviewDetails) => !!interviewDetails),
        tap((interviewDetails) => {
          console.log(interviewDetails);
          this.interviewDetails = interviewDetails;
        })
      )
      .subscribe();
    this.errors
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((error) => !!error),
        tap((error) => showSnackbar(this.toastr, { error, type: 'error' }))
      )
      .subscribe();
  }
  ngAfterViewInit() {
    this.store.dispatch(
      InterviewsActions.loadInterview({ id: this.interviewId() })
    );
  }

  CurrentPagePath(): RouteLink[] {
    return [
      { path: `/${this.lang()}/agents`, label: 'AI Agents' },
      {
        path: `/${this.lang()}/agents/agent/${this.id()}`,
        label: 'View Agent',
      },
      {
        path: `/${this.lang()}/agents/agent/${this.id()}/interview-details/${this.interviewId()}`,
        label: 'View Interview',
      },
    ];
  }
}
