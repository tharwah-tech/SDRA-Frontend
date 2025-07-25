import { AgentType } from "../../../../core/enums/agents-type.enum";

export interface AgentEntity {
  id: string;
  name: string;
  role: string; // e.g., "Interviewer"
  description: string;
  avatarUrl: string;
  personality: PersonalityTrait[];
  supportedOutputs: SupportedOutput[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PersonalityTrait {
  id: string;
  trait: string; // e.g., "Calm", "Professional", "Neutral Accent"
}

export interface SupportedOutput {
  id: string;
  type: OutputType;
  isEnabled: boolean;
}

export enum OutputType {
  VIDEO = 'Video',
  AUDIO = 'Audio',
  TRANSCRIPT = 'Transcript'
}

export interface AgentSummaryEntity {
    id:          string;
    name:        string;
    description: string;
    type:        AgentType;
    img_url:     string;
}
