import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  InjectionToken,
  importProvidersFrom
} from '@angular/core';
import {provideRouter, withComponentInputBinding, withRouterConfig} from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import {HttpClient, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {routes} from './app.routes';
import {environment} from '../environments/environment';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideToastr} from 'ngx-toastr';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';

export const BASE_API_URL = new InjectionToken<string>('BASE_API_URL');

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
    provideRouter(routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      } as any)),
    provideHttpClient(
      withInterceptors([]),
      withFetch()
    ),
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
    { provide: BASE_API_URL, useValue: environment.apiUrl },
    provideAnimations(),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      newestOnTop: true,
      // You can add more global configuration options here
    }),
    provideNativeDateAdapter(),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, // If set to true, will include stack trace for every dispatched action
      traceLimit: 75, // Maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
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
  ]
};

