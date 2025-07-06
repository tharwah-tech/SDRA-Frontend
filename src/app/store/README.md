# NgRx Store Implementation

This project uses NgRx version 19.2.1 for state management, which is compatible with Angular 19.

## Installed NgRx Packages

- `@ngrx/store`: The core state management library
- `@ngrx/effects`: For handling side effects
- `@ngrx/entity`: Provides entity adapter for managing collections
- `@ngrx/router-store`: Connects the Angular Router to the NgRx store
- `@ngrx/store-devtools`: Provides debugging capabilities for the store

## Getting Started

After installation, you need to set up the store in your app.module.ts or standalone components.

### Basic Setup Example

```typescript
// In app.config.ts
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects()
  ]
};
```

## Adding Feature States

Create feature states in dedicated directories under the store folder.

## Resources

- [NgRx Documentation](https://ngrx.io/)
- [NgRx GitHub Repository](https://github.com/ngrx/platform)
