import { AgentType } from '../../../../core/enums/agents-type.enum';
import { AgentEntity } from '../../domain/entities/agent.entity';
export interface AgentModel extends AgentEntity{}
export interface AgentSummaryModel {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  img_url: string;
}
