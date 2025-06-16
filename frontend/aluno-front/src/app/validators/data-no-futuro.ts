import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dataNoFuturoValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const data = control.value;
    const hoje = new Date();

    if (!data || !(data instanceof Date)) {
      return { dataInvalida: true };
    }

    data.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    return data <= hoje ? null : { dataNoFuturo: true };
  };
}
