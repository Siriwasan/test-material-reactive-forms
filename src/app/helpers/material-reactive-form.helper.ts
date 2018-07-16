import { FormGroup, ValidatorFn, FormBuilder } from '@angular/forms';

export interface Field {
  name: string;
  value?: any;
  validation?: ValidatorFn;
  conditions?: Condition[];
}

export interface Condition {
  values: any[]; // difference conditions can have same result, difference conditions can have partially same result
  subcontrols: string[]; // one result can have many control
}
// Note: if no any control declaration in hierarchy, default is SHOW

interface FieldNode {
  controlName: string;
  parentControl: string;
  conditionValues: any[];
}

export class MaterialReactiveFormHelper {
  private formGroup: FormGroup;
  private fields: Field[];
  private fieldNodes: FieldNode[] = [];
  private isAlwayShow = false;

  constructor() { }

  createMaterialReactiveForm(formBuilder: FormBuilder, controls: object): FormGroup {
    // remap the API to be suitable for iterating over it
    this.fields =
      Object.keys(controls)
        .map(prop => {
          return Object.assign({}, {name: prop} , controls[prop]);
        });

    this.formGroup = formBuilder.group({});
    this.fields.forEach(e => {
      this.formGroup.addControl(e.name, formBuilder.control(e.value, e.validation));
    });

    this.initializeHierarchy();

    return this.formGroup;
  }

  private initializeHierarchy() {
    this.createHierarchyNodes();
    // this.subscribeValueChanges();

    console.log(this.fieldNodes);
  }

  private createHierarchyNodes() {
    this.fields.forEach(control => {
      if (control.conditions !== undefined) {
        control.conditions.forEach(condition => {
          for (let index = 0; index < condition.subcontrols.length; index++) {
            const subcontrol = condition.subcontrols[index];

            const newNode: FieldNode = {
              controlName: null,
              parentControl: control.name,
              conditionValues: []
            };

            const sameControlandParentNode =
              this.fieldNodes.find(node => node.controlName === subcontrol && node.parentControl === control.name);

            if ( sameControlandParentNode === undefined) {
              newNode.controlName = subcontrol;
              newNode.conditionValues.push(...condition.values);
              this.fieldNodes.push(newNode);
            } else {
              sameControlandParentNode.conditionValues.push(...condition.values);
            }
          }
        });
      }
    });
  }

  private subscribeValueChanges() {
    this.fields.forEach(control => {
      this.formGroup.get(control.name).valueChanges.subscribe(newValue => {
        const oldValue = this.formGroup.value[control.name];
        const targetNode = this.fields.find(node => node.name === control.name);

        if (control.conditions !== undefined) {
          for (let index = 0; index < targetNode.conditions.length; index++) {
            const condition = targetNode.conditions[index];

            // if old value is in hierarchy, reset controls
            if (condition.values.find(value => this.isEquivalent(value, oldValue)) !== undefined) {
              const newCondition = targetNode.conditions.find(cc => cc.values.find(value => this.isEquivalent(value, newValue)));

              condition.subcontrols.forEach(subcontrol => {
                // if new value has no condition or new value's condition is not the same, reset the value
                if (newCondition === undefined || newCondition.subcontrols.find(p => p === subcontrol) === undefined) {
                  const sub = this.formGroup.get(subcontrol);

                  // if it is a angular material control, reset value
                  if (sub !== null) {
                    sub.reset();
                  }
                }
              });
              break;
            }
          }
        }
      });
    });
  }

  showHierarchy(controlName: string): boolean {
    if (this.isAlwayShow) {
      return true;
    }

    const targetNodes = this.fieldNodes.filter(node => node.controlName === controlName);

    if (targetNodes.length === 0) {
      return true;
    }

    for (let i = 0; i < targetNodes.length; i++) {
      const node = targetNodes[i];

      for (let index = 0; index < node.conditionValues.length; index++) {
        const value = node.conditionValues[index];

        if (this.isEquivalent(this.formGroup.get(node.parentControl).value, value)) {
          return true;
        }
      }
    }

    // reset control if it is not show
    const sub = this.formGroup.get(controlName);

    // if it is a angular material control, reset value
    if (sub !== null) {
      sub.reset();
    }

    return false;
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
}
