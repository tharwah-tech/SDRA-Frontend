import { CommonModule } from '@angular/common';
import { Component, input, OnInit, DestroyRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MainPageStructureComponent } from '../../../../../shared/components/main-page-structure/main-page-structure.component';
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';
import { CreateInterviewFormComponent } from '../../components/create-interview-form/create-interview-form.component';
import { CreateInteviewEntity } from '../../../domain/entities/create-interview.entity';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { InterviewsActions } from '../../store/interviews/interviews.actions';
import { filter, Observable, tap } from 'rxjs';
import { ApiError } from '../../../../../core/models/api-error.model';
import { selectInterviewsError } from '../../store/interviews/interviews.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-interview-page',
  imports: [
    CommonModule,
    TranslateModule,
    MainPageStructureComponent,
    CreateInterviewFormComponent,
  ],
  templateUrl: './create-interview-page.component.html',
  styleUrl: './create-interview-page.component.scss',
})
export class CreateInterviewPageComponent implements OnInit{
  SideNavTabs = SideNavTabs;
  lang = input.required<string>();
  id = input.required<string>();
  error$: Observable<ApiError | null>;
  constructor(
    private router: Router,
    private store: Store,
    private toastr: ToastrService,
    private destroyRef: DestroyRef
  ) {
    this.error$ = this.store.select(selectInterviewsError);
  }
  ngOnInit(): void {
    // Initialization logic if needed
    this.error$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((error) => !!error),
        tap((error) => showSnackbar(this.toastr, { error, type: 'error' }))
      )
      .subscribe();
  }

  CurrentPagePath(): RouteLink[] {
    return [
      { path: `/${this.lang()}/agents`, label: 'AI Agents' },
      {
        path: `/${this.lang()}/agents/agent/${this.id()}`,
        label: 'View Agent',
      },
      {
        path: `/${this.lang()}/agents/agent/${this.id()}/create-interview`,
        label: 'Create Interview',
      },
    ];
  }
  submitInterview(interview: CreateInteviewEntity) {
    this.store.dispatch(InterviewsActions.createInterview({ interview }));
  }
}
