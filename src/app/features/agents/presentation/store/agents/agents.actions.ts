import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { AgentEntity, AgentSummaryEntity } from "../../../domain/entities/agent.entity";
import { AGENTS_FEATURE_KEY } from "./agents.state";
import { ApiError } from "../../../../../core/models/api-error.model";

export const AgentsActions = createActionGroup({
  source: AGENTS_FEATURE_KEY,
  events: {
    'Load Agents': emptyProps(),
    'Load Agents Success': props<{ agents: AgentSummaryEntity[] }>(),
    'Load Agents Failure': props<{ error: ApiError }>(),

    'Load Agent': props<{ id: string }>(),
    'Load Agent Success': props<{ agent: AgentEntity }>(),
    'Load Agent Failure': props<{ error: ApiError }>(),

    'Clear Selected Agent': emptyProps(),
  }
  });


