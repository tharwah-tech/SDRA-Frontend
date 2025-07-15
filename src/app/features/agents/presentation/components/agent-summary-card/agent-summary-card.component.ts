import { Component, input } from '@angular/core';
import { AgentSummaryEntity } from '../../../domain/entities/agent.entity';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AgentType, mapAgentType } from '../../../../../core/enums/agents-type.enum';

@Component({
  selector: 'app-agent-summary-card',
  imports: [CommonModule, TranslateModule, RouterModule, MatIconModule],
  templateUrl: './agent-summary-card.component.html',
  styleUrl: './agent-summary-card.component.scss',
})
export class AgentSummaryCardComponent {
  agent = input.required<AgentSummaryEntity>();
  AgentType = AgentType;
  constructor() {
    // You can initialize any additional properties or services here if needed
  }
  getAgentTypeString(type: AgentType): string{
    return mapAgentType(type);
  }
}
