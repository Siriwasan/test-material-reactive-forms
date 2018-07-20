import { FormGroup, ValidatorFn, FormBuilder } from '@angular/forms';

export interface FieldContent {
  [key: string]: Field;
}

export interface Field {
  name?: string;
  value?: any;
  validation?: ValidatorFn;
  validation_message?: ValidationMessage[];
  conditions?: Condition[][]; // External array is AND condition, Interanl array is OR condition
}

export interface ValidationMessage {
  type: string;
  message: string;
}

export interface Condition {
  parent: string;
  value: any;
}

export class MaterialReactiveFormHelper {
  private formGroup: FormGroup;
  private fields: Field[] = [];
  private isAlwayShow = false;

  constructor() { }

  createMaterialReactiveForm(formBuilder: FormBuilder, controls: FieldContent[]): FormGroup {
    // remap the API to be suitable for iterating over it
    controls.forEach(e => {
      Object.keys(e)
            .map(prop => {
              this.fields.push(Object.assign({}, {name: prop} , e[prop]));
            });
    });

    this.formGroup = formBuilder.group({});
    this.fields.forEach(e => {
      this.formGroup.addControl(e.name, formBuilder.control(e.value, e.validation));
    });

    return this.formGroup;
  }

  showControl(controlName: string): boolean {
    if (this.isAlwayShow) {
      return true;
    }

    const targetNode = this.fields.find(node => node.name === controlName);

    // alway show if can't find control in fieldNodes or no any conditions
    if (targetNode === undefined || targetNode.conditions === undefined) {
      return true;
    }

    let foundSomeCondition = null;

    for (let index = 0; index < targetNode.conditions.length; index++) {
      const condition = targetNode.conditions[index];

      let foundSubCondition = true;

      for (let i = 0; i < condition.length; i++) {
        const subcondition = condition[i];

        const value = subcondition.value;
        const parentControl = this.formGroup.get(subcondition.parent);

        if (parentControl !== null) {
          foundSubCondition = foundSubCondition && this.isEquivalent(parentControl.value, value);
        }
      }

      if (foundSubCondition) {
        foundSomeCondition = true;
        break;
      }
    }

    // reset control if it is not show
    if (!foundSomeCondition) {
      const sub = this.formGroup.get(controlName);

      // if it is a angular material control, reset value
      if (sub !== null) {
        sub.reset();
      }
    }

    return foundSomeCondition;
  }

  alwayShow(show: boolean = true) {
    this.isAlwayShow = show;
  }

  private isEquivalent(a: any, b: any): boolean {
    if (a === null || b === null) {
      return false;
    }

    // exclude compare 'null'(object) with basic type
    if (typeof a === 'object' && typeof b === 'object') {
      // console.log('a:' + typeof a + ' b:' + typeof b);
      // console.log('a:' + a + ' b:' + b);
      console.log('It\'s object');
      return this.compareObject(a, b);
    }

    return a === b;
  }

  private compareObject(a: any, b: any): boolean {
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
        return false;
    }

    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

  getValidationMessage(controlName: string): ValidationMessage[] {
    const targetNode = this.fields.find(node => node.name === controlName);

    if (targetNode === undefined || targetNode.validation_message === undefined) {
      return null;
    }

    return targetNode.validation_message;
  }
}
