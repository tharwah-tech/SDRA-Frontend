import { Component, DestroyRef, input, OnInit, AfterViewInit } from '@angular/core';
import { MainPageStructureComponent } from '../../../../../shared/components/main-page-structure/main-page-structure.component';
import { SideNavTabs } from '../../../../../core/enums/side-nave-tabs.enum';
import { Route, Router } from '@angular/router';
import { RouteLink } from '../../../../../shared/components/page-navigation-routes/page-navigation-routes.component';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AgentSummaryEntity } from '../../../domain/entities/agent.entity';
import { AgentSummaryCardComponent } from '../../components/agent-summary-card/agent-summary-card.component';
import { AgentType } from '../../../../../core/enums/agents-type.enum';
import { filter, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../../../../core/services/language.service';
import {
  selectAgentsError,
  selectAgentsLoading,
  selectAllAgents,
} from '../../store/agents/agents.selectors';
import { ApiError } from '../../../../../core/models/api-error.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { showSnackbar } from '../../../../../shared/utils/show-snackbar-notification.util';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AgentsActions } from '../../store/agents/agents.actions';

@Component({
  selector: 'app-agents-page',
  imports: [
    CommonModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MainPageStructureComponent,
    AgentSummaryCardComponent,
  ],
  templateUrl: './agents-page.component.html',
  styleUrl: './agents-page.component.scss',
})
export class AgentsPageComponent implements OnInit, AfterViewInit {
  SideNavTabs = SideNavTabs;
  lang = input.required<string>();
  loading$: Observable<boolean>;
  error$: Observable<ApiError | null>;
  agents$: Observable<AgentSummaryEntity[]>;
  agentsList!: AgentSummaryEntity[];
  constructor(
    public translateService: TranslateService,
    public languageService: LanguageService,
    private destroyRef: DestroyRef,
    private toastr: ToastrService,
    private router: Router,
    private store: Store
  ) {
    // Initialize agentsList with some dummy data or fetch from a service
    this.agents$ = this.store.select(selectAllAgents);
    this.loading$ = this.store.select(selectAgentsLoading);
    this.error$ = this.store.select(selectAgentsError);
  }
  ngOnInit() {
    this.agents$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((val) => !!val),
        tap((agents) => (this.agentsList = agents))
      )
      .subscribe();
    this.error$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((val) => !!val),
        tap((error) => showSnackbar(this.toastr, { error, type: 'error' }))
      )
      .subscribe();
  }
  ngAfterViewInit(){
    this.store.dispatch(AgentsActions.loadAgents())
  }
  CurrentPagePath(): RouteLink[] {
    return [{ path: `/${this.lang()}/agents`, label: 'AI Agents' }];
  }
}
