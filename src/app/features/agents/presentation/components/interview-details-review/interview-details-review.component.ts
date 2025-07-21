import { CommonModule } from '@angular/common';
import { Component, DestroyRef, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InterviewDetailsEntity } from '../../../domain/entities/interview-details.entity';
import { Store } from '@ngrx/store';
import { filter, Observable, tap } from 'rxjs';
import { selectSelectedInterview } from '../../store/interviews/interviews.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../../core/services/language.service';
import { ToastrService } from 'ngx-toastr';
import { AgentEntity } from '../../../domain/entities/agent.entity';
import { selectSelectedAgent } from '../../store/agents/agents.selectors';

@Component({
  selector: 'app-interview-details-review',
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './interview-details-review.component.html',
  styleUrl: './interview-details-review.component.scss',
})
export class InterviewDetailsReviewComponent {
  selectedAgent$: Observable<AgentEntity | null>;
  selectedAgent: AgentEntity | null = null;
  interviewDetails$: Observable<InterviewDetailsEntity | null>;
  interviewDetails: InterviewDetailsEntity | null = null;
  constructor(public translateService: TranslateService,
    public languageService: LanguageService,
    private destroyRef: DestroyRef,
    private toastr: ToastrService,
    private router: Router,
    private store: Store) {
      this.interviewDetails$ = this.store.select(selectSelectedInterview);
      this.selectedAgent$ = this.store.select(selectSelectedAgent);
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
    this.selectedAgent$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((selectedAgent) => !!selectedAgent),
        tap((selectedAgent) => {
          this.selectedAgent = selectedAgent;
        })
      )
      .subscribe();
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
