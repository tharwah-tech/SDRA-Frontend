// Updated Agent Card Component TypeScript
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import {
  AgentEntity,
  SupportedOutput,
  OutputType,
} from '../../../domain/entities/agent.entity';
import { AgentType, mapAgentType } from '../../../../../core/enums/agents-type.enum';

@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './agent-card.component.html',
  styleUrls: ['./agent-card.component.scss'],
})
export class AgentCardComponent implements OnInit {
  @Input() agent!: AgentEntity;
  enabledOutputs: SupportedOutput[] = [];
  AgentType = AgentType;

  ngOnInit(): void {
    this.loadEnabledOutputs();
  }

  private loadEnabledOutputs(): void {
    this.enabledOutputs =
      this.agent.supportedOutputs?.filter((output) => output.isEnabled) || [];
  }

  getOutputIcon(type: OutputType): string {
    const icons: { [key in OutputType]: string } = {
      [OutputType.VIDEO]: 'videocam',
      [OutputType.AUDIO]: 'mic',
      [OutputType.TRANSCRIPT]: 'description',
    };
    return icons[type] || 'help';
  }

  getOutptIconPath(type: OutputType): string {
    switch (type) {
      case OutputType.AUDIO:
        return '../../../../../../assets/images/icons/audo-green.svg';
      case OutputType.VIDEO:
        return '../../../../../../assets/images/icons/video-blue.svg';
      case OutputType.TRANSCRIPT:
        return '../../../../../../assets/images/icons/transcript-purple.svg';
    }
  }

  getOutputIconClass(type: OutputType): string {
    const classes: { [key in OutputType]: string } = {
      [OutputType.VIDEO]: 'text-blue-600',
      [OutputType.AUDIO]: 'text-green-600',
      [OutputType.TRANSCRIPT]: 'text-purple-600',
    };
    return classes[type] || 'text-gray-600';
  }

  getOutputIconBackgroundClass(type: OutputType): string {
    const classes: { [key in OutputType]: string } = {
      [OutputType.VIDEO]: 'bg-blue-50',
      [OutputType.AUDIO]: 'bg-green-50',
      [OutputType.TRANSCRIPT]: 'bg-purple-50',
    };
    return classes[type] || 'bg-gray-50';
  }

  getAgentTypeString(type: AgentType):string{
    return mapAgentType(type);
  }
}
