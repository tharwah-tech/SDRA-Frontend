import { Router } from '@angular/router';
import { routes } from './../../../../../app.routes';
import {Component, input} from '@angular/core';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
 lang= input.required<string>();
 constructor(private routes: Router) {}
 goToLogin() {
   this.routes.navigate([`${this.lang()}/auth/login`]);
 }
 goToRegister() {
   this.routes.navigate([this.lang(),"auth","register"]);
 }
}
