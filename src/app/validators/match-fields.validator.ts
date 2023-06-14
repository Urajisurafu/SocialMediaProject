import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function fieldsMatchValidator(
  field1: string,
  field2: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const control1 = control.get(field1)?.value;
    const control2 = control.get(field2)?.value;

    if (control1 !== control2) {
      return { fieldsMatch: true };
    }

    return null;
  };
}
