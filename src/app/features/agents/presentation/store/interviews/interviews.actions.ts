
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { InterviewEntity, InterviewsResponse } from '../../../domain/entities/interview.entity';
import { INTERVIEWS_FEATURE_KEY } from './interviews.state';

export const InterviewsActions = createActionGroup({
  source: INTERVIEWS_FEATURE_KEY,
  events: {
    'Load Interviews': emptyProps(),
    'Load Interviews Success': props<{ response: InterviewsResponse }>(),
    'Load Interviews Failure': props<{ error: string }>(),
    
    'Load Interview': props<{ id: string }>(),
    'Load Interview Success': props<{ interview: InterviewEntity }>(),
    'Load Interview Failure': props<{ error: string }>(),
    
    'Update Interview Status': props<{ id: string; status: string }>(),
    'Update Interview Status Success': props<{ interview: InterviewEntity }>(),
    'Update Interview Status Failure': props<{ error: string }>(),
    
    'Delete Interview': props<{ id: string }>(),
    'Delete Interview Success': props<{ id: string }>(),
    'Delete Interview Failure': props<{ error: string }>(),
    
    'Clear Selected Interview': emptyProps(),
    'Set Selected Interview': props<{ interview: InterviewEntity }>(),
  }
});