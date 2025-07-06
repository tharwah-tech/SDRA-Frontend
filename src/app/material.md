# Angular Material in SDRA Frontend

This project uses Angular Material version 19.x, which is compatible with Angular 19.

## Installed Packages

- `@angular/material`: The core Material components
- `@angular/cdk`: The Component Development Kit (CDK)

## Setup

Angular Material has been set up with:

1. Material components installed via npm
2. BrowserAnimations module included in app.config.ts
3. A default Material theme in styles.scss
4. Roboto font and Material icons added to index.html

## Using Material Components

To use a Material component:

1. Import the specific component module in your component file
2. Add it to the imports array
3. Use the component in your template

Example:

```typescript
// component.ts
import { MatButtonModule } from '@angular/material/button';

@Component({
  // ...
  imports: [MatButtonModule],
  // ...
})
```

```html
<!-- component.html -->
<button mat-raised-button color="primary">Click me</button>
```

## Available Components

Angular Material provides many components, including:

- Buttons & Indicators
- Form Controls
- Navigation
- Layout
- Popups & Modals
- Data Table

For a full list and documentation, visit the [Angular Material website](https://material.angular.io/components/categories).

## Theming

The project uses a custom theme defined in styles.scss. You can modify this theme by changing the color palettes and other theme settings.

## Resources

- [Angular Material Documentation](https://material.angular.io/)
- [Material Design Guidelines](https://material.io/design)
- [Angular CDK Documentation](https://material.angular.io/cdk/categories)
