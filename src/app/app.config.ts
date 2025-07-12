// src/app/app.config.ts

import {
  ApplicationConfig,
  isDevMode,
  InjectionToken,
  importProvidersFrom,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

// Global authentication providers (keep these global as they're used app-wide)
import { AuthEffects } from './features/authentication/presentation/store/auth.effects';
import { authReducer } from './features/authentication/presentation/store/auth.reducer';
import { AuthService } from './features/authentication/data/services/auth.service';
import { AUTH_REPOSITORY } from './features/authentication/data/providers/auth-repositories.provider';
import { AGENTS_REPOSITORY } from './features/agents/data/services/agents.provider';
import { AgentsService } from './features/agents/data/services/agents.service';
import { AgentsMockService } from './features/agents/data/services/agents-mock.service';
import { INTERVIEWS_REPOSITORY } from './features/agents/data/services/interviews.provider';
import { InterviewsService } from './features/agents/data/services/interviews.service';

// Global API URL token
export const BASE_API_URL = new InjectionToken<string>('BASE_API_URL');

// Translation loader factory
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function provideTranslateLoader() {
  return (
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }).providers || []
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Core Angular providers
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      } as any)
    ),

    // HTTP client with interceptors
    provideHttpClient(withInterceptors([]), withFetch()),

    // Translation service (global)
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    TranslateService,

    // Global API URL
    { provide: BASE_API_URL, useValue: environment.apiUrl },

    // Global authentication providers (used throughout the app)
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthService,
    },
    {
      provide: AGENTS_REPOSITORY,
      useClass: environment.production ? AgentsService : AgentsMockService,
    },
    {
      provide: INTERVIEWS_REPOSITORY,
      useClass: InterviewsService,
    },
    // Animation providers
    provideAnimations(),
    provideAnimationsAsync(),

    // Global notification service
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      newestOnTop: true,
    }),

    // Date handling
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'MM/dd/yyyy',
        },
        display: {
          dateInput: 'dd/MMM/yyyy',
          monthYearLabel: 'MMM yyyy',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM yyyy',
        },
      },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },

    // Global NgRx store configuration
    // Only include global/shared state here - features manage their own state
    provideStore({
      auth: authReducer, // Authentication is global
      // Note: Feature-specific state (agents, interviews) is now managed at feature level
    }),

    // Global effects (only for global features like auth)
    provideEffects([AuthEffects]),

    // NgRx DevTools (development only)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
  ],
};
