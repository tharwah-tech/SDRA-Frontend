import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AgentEntity } from "../../../domain/entities/agent.entity";
import { AGENTS_FEATURE_KEY } from "./agents.state";

export const AgentsActions = createActionGroup({
  source: AGENTS_FEATURE_KEY,
  events: {
    'Load Agents': emptyProps(),
    'Load Agents Success': props<{ agents: AgentEntity[] }>(),
    'Load Agents Failure': props<{ error: string }>(),

    'Load Agent': props<{ id: string }>(),
    'Load Agent Success': props<{ agent: AgentEntity }>(),
    'Load Agent Failure': props<{ error: string }>(),

    'Clear Selected Agent': emptyProps(),
  }
  });


  