import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { TranslateModule } from '@ngx-translate/core';
import { AgentEntity, OutputType } from '../../../domain/entities/agent.entity';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatBadgeModule,
    TranslateModule
  ],
  templateUrl: './agent-card.component.html',
  styleUrls: ['./agent-card.component.scss'] // Optional: include if you need Material overrides
})
export class AgentCardComponent {
  @Input({ required: true }) agent!: AgentEntity;

  // Helper to get icon for output type
  getOutputIcon(type: OutputType): string {
    switch (type) {
      case OutputType.VIDEO:
        return 'videocam';
      case OutputType.AUDIO:
        return 'mic';
      case OutputType.TRANSCRIPT:
        return 'description';
      default:
        return 'help_outline';
    }
  }

  // Helper to get icon color class for output type
  getOutputIconClass(type: OutputType): string {
    switch (type) {
      case OutputType.VIDEO:
        return 'text-blue-600';
      case OutputType.AUDIO:
        return 'text-green-600';
      case OutputType.TRANSCRIPT:
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  }

  // Helper to get enabled outputs
  get enabledOutputs() {
    return this.agent.supportedOutputs.filter(output => output.isEnabled);
  }
}