import { Component, input } from '@angular/core';

@Component({
  selector: 'app-start-interview-page',
  imports: [],
  templateUrl: './start-interview-page.component.html',
  styleUrl: './start-interview-page.component.scss'
})
export class StartInterviewPageComponent {
 interviewURL = input.required<string>();
}
