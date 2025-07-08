
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
  styleUrls: ['./agent-card.component.scss']
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

  // Helper to get enabled outputs
  get enabledOutputs() {
    return this.agent.supportedOutputs.filter(output => output.isEnabled);
  }


}