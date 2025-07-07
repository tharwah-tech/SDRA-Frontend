
import { OutputType } from '../../domain/entities/agent.entity';

export interface AgentDto {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarUrl: string;
  personality: PersonalityTraitDto[];
  supportedOutputs: SupportedOutputDto[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalityTraitDto {
  id: string;
  trait: string;
}

export interface SupportedOutputDto {
  id: string;
  type: OutputType;
  isEnabled: boolean;
}

export interface CreateAgentDto {
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  personality: string[]; // Array of trait names
  supportedOutputs: OutputType[];
}

export interface UpdateAgentDto {
  name?: string;
  role?: string;
  description?: string;
  avatarUrl?: string;
  personality?: string[];
  supportedOutputs?: OutputType[];
  isActive?: boolean;
}

export interface ConfigureAgentDto {
  // Add configuration-specific fields
  settings?: Record<string, any>;
  permissions?: string[];
  integrations?: string[];
}