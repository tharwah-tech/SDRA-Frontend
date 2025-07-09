import { AbstractControl } from "@angular/forms";

function mustContainSpecialChar(control: AbstractControl) {
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
  if (specialCharPattern.test(control.value)) {
    return null;
  }
  return { doesNotContainSpecialChar: true };
}

export { mustContainSpecialChar };
export type MustContainSpecialCharValidator = typeof mustContainSpecialChar;
