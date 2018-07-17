import { FormControl } from '@angular/forms';

export class PINValidator {
  static validCheckDigit(control: FormControl) {
    const PIN = control.value;

    if (PIN === null) {
      return null;
    }

    let sum = 0;

    for (let index = 0; index < PIN.length - 1; index++) {
      sum += Number(PIN[index]) * (13 - index);
    }

    // check digit formula
    if (11 - (sum % 11) !== Number(PIN[12])) {
      return { validPIN: true };
    } else {
      return null;
    }
  }
}
