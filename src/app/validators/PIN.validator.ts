import { FormControl } from '@angular/forms';

export class PINValidator {

  static validPIN(control: FormControl) {
    const PIN = control.value;

    if (PIN === null) {
      return null;
    }

    if (PIN.length !== 13) {
      return { PINlenght: true };
    } else if (!PINValidator.validateCheckDigit(PIN)) {
      return {
        validPIN: true
      };
    } else {
      return null;
    }
  }

  static validateCheckDigit(PIN: string): boolean {
    let sum = 0;

    for (let index = 0; index < PIN.length - 1; index++) {
      sum += Number(PIN[index]) * (13 - index);
    }

    return 11 - (sum % 11) === Number(PIN[12]);
  }
}
