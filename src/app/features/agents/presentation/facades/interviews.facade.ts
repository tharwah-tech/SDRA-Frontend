// src/app/features/agents/presentation/facades/interviews.facade.ts

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { InterviewEntity } from '../../domain/entities/interview.entity';
import { InterviewsActions } from '../store/interviews/interviews.actions';
import { 
  selectAllInterviews, 
  selectSelectedInterview, 
  selectInterviewsLoading, 
  selectInterviewsError,
  selectInterviewsCount,
  selectInterviewsPagination,
  selectInterviewById,
  selectInterviewsByStatus
} from '../store/interviews/interviews.selectors';

@Injectable({
  providedIn: 'root'
})
export class InterviewsFacade {
  interviews$: Observable<InterviewEntity[]>;
  selectedInterview$: Observable<InterviewEntity | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  count$: Observable<number>;
  pagination$: Observable<{
    totalCount: number;
    pagesCount: number;
    currentPage: number;
    currentPageSize: number;
  }>;

  constructor(private store: Store) {
    this.interviews$ = this.store.select(selectAllInterviews);
    this.selectedInterview$ = this.store.select(selectSelectedInterview);
    this.loading$ = this.store.select(selectInterviewsLoading);
    this.error$ = this.store.select(selectInterviewsError);
    this.count$ = this.store.select(selectInterviewsCount);
    this.pagination$ = this.store.select(selectInterviewsPagination);
  }

  loadInterviews(): void {
    this.store.dispatch(InterviewsActions.loadInterviews());
  }

  loadInterview(id: string): void {
    this.store.dispatch(InterviewsActions.loadInterview({ id }));
  }

  updateInterviewStatus(id: string, status: string): void {
    this.store.dispatch(InterviewsActions.updateInterviewStatus({ id, status }));
  }

  deleteInterview(id: string): void {
    this.store.dispatch(InterviewsActions.deleteInterview({ id }));
  }

  clearSelectedInterview(): void {
    this.store.dispatch(InterviewsActions.clearSelectedInterview());
  }

  setSelectedInterview(interview: InterviewEntity): void {
    this.store.dispatch(InterviewsActions.setSelectedInterview({ interview }));
  }

  getInterviewById(id: string): Observable<InterviewEntity | undefined> {
    return this.store.select(selectInterviewById(id));
  }

  getInterviewsByStatus(status: string): Observable<InterviewEntity[]> {
    return this.store.select(selectInterviewsByStatus(status));
  }
}