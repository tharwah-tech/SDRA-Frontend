import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidnave-item',
  imports: [CommonModule, TranslateModule,],
  templateUrl: './sidnave-item.component.html',
  styleUrl: './sidnave-item.component.scss',
})
export class SidnaveItemComponent {
  isActive = input<boolean>(false);
  tabTitle = input<string>('');
  icon = input<string>('');
  iconActive = input<string>('');
  tabLink = input<string[]>([]);
  isDisabled = input<boolean>(false);
  constructor(private routes: Router) {
    // Initialization logic can go here if needed
  }
  navigateToTabPage(): void {
    if (!this.isDisabled() && !this.isActive()) {
      // Logic to handle click event, e.g., navigation
      this.routes.navigate([...this.tabLink()], { queryParams: { tab: this.tabTitle() } });
    }
  }
}
