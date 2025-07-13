import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-complete-interview-page',
  imports: [CommonModule],
  templateUrl: './complete-interview-page.component.html',
  styleUrl: './complete-interview-page.component.scss',
})
export class CompleteInterviewPageComponent {
  interviewId!: string | null;
  completeDate!: Date | null;
  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((params) => {
      this.interviewId = params.get('interviewId');
      const completeDateString = params.get('completeDate');
      this.completeDate = completeDateString ? new Date(completeDateString) : null;
    });
  }
}
