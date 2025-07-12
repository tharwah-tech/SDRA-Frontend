import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom validator for FormArray minimum length
export function minArrayLength(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      return control.length >= min ? null : { minArrayLength: { requiredLength: min, actualLength: control.length } };
    }
    return null;
  };
}
