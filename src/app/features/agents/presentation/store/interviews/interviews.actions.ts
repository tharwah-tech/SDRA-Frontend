
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { InterviewEntity, InterviewsResponse } from '../../../domain/entities/interview.entity';
import { INTERVIEWS_FEATURE_KEY } from './interviews.state';
import { InterviewDetailsEntity } from '../../../domain/entities/interview-details.entity';
import { ApiError } from '../../../../../core/models/api-error.model';
import { CreateInteviewEntity } from '../../../domain/entities/create-interview.entity';

export const InterviewsActions = createActionGroup({
  source: INTERVIEWS_FEATURE_KEY,
  events: {
    'Load Interviews': emptyProps(),
    'Load Interviews Success': props<{ response: InterviewsResponse }>(),
    'Load Interviews Failure': props<{ error: ApiError }>(),

    'Load Interview': props<{ id: string }>(),
    'Load Interview Success': props<{ interview: InterviewDetailsEntity }>(),
    'Load Interview Failure': props<{ error: ApiError }>(),

    'Create Interview': props<{ interview: CreateInteviewEntity }>(),
    'Create Interview Success': props<{ interviewId: string }>(),
    'Create Interview Failure': props<{ error: ApiError }>(),

    'Update Interview Status': props<{ id: string; status: string }>(),
    'Update Interview Status Success': props<{ interview: InterviewDetailsEntity }>(),
    'Update Interview Status Failure': props<{ error: ApiError }>(),

    'Delete Interview': props<{ id: string }>(),
    'Delete Interview Success': props<{ id: string }>(),
    'Delete Interview Failure': props<{ error: ApiError }>(),

    'Share Interview': props<{interviewId: string}>(),
    'Share Interview Success':props<{token: string}>(),
    'Share Interview Failure': props<{ error: ApiError }>(),
    'Set Inteview Token': props<{token: string}>(),

    'Get Interview Link': props<{token: string}>(),
    'Get Interview Link Success': props<{interviewLink: string}>(),
    'Get Interview Link Fails': props<{ error: ApiError }>(),
    'Set Inteview Link': props<{interviewLink: string}>(),

    'Clear Selected Interview': emptyProps(),
    'Set Selected Interview': props<{ interview: InterviewDetailsEntity }>(),

    'Set Error': props<{error: ApiError}>()
  }
});
