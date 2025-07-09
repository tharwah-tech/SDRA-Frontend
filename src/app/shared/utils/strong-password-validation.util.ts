import { AbstractControl } from "@angular/forms";

function strongPasswordValidation(control: AbstractControl) {
  const strongPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
  if (strongPasswordPattern.test(control.value)) {
    return null;
  }
  return { weakPassword: true };
}
export { strongPasswordValidation };
export type StrongPasswordValidator = typeof strongPasswordValidation;
