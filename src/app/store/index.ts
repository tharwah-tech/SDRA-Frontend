import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { isDevMode } from '@angular/core';

export interface AppState {
  // Define your root state properties here
}

export const reducers: ActionReducerMap<AppState> = {
  // Add your reducers here
};

export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
