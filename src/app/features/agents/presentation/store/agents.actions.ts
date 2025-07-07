import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AgentEntity } from "../../domain/entities/agent.entity";

export const AgentsActions = createActionGroup({
  source: 'Agents',
  events: {
    'Load Agents': emptyProps(),
    'Load Agents Success': props<{ agents: AgentEntity[] }>(),
    'Load Agents Failure': props<{ error: string }>(),

    'Load Agent': props<{ id: string }>(),
    'Load Agent Success': props<{ agent: AgentEntity }>(),
    'Load Agent Failure': props<{ error: string }>(),

    'Select Agent': props<{ agent: AgentEntity }>(),
    'Clear Selected Agent': emptyProps(),

    'Configure Agent': props<{ agentId: string }>(),

  }
  });