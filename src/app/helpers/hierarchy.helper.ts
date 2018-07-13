import { FormGroup, ValidatorFn } from '@angular/forms';

export interface ControlHierarchy {
  name: string;
  conditions: Condition[]; // one control can have no condition or many conditions
}

export interface Condition {
  values: any[]; // difference conditions can have same result, difference conditions can have partially same result
  subcontrols: string[]; // one result can have many control
}
// Note: if no any control declaration in hierarchy, default is SHOW

export interface Field {
  name: string;
  value?: any;
  validation?: ValidatorFn;
  conditions?: Condition[];
}

interface HierarchyNode {
  controlName: string;
  parentControl: string;
  conditionValues: any[];
}

export class HierarchyHelper {
  private formGroup: FormGroup;
  private hierarchy: ControlHierarchy[];
  private hierarchyNodes: HierarchyNode[] = [];
  private isAlwayShow = false;

  constructor() { }

  initializeHierarchy(form: FormGroup, hierarchy: any[]) {
    this.formGroup = form;
    this.hierarchy = hierarchy;

    this.createHierarchyNodes(this.hierarchy);
    this.subscribeValueChanges(this.hierarchy);

    console.log(this.hierarchyNodes);
  }

  private createHierarchyNodes(controls: Field[]) {
    controls.forEach(control => {
      if (control.conditions !== undefined) {
        control.conditions.forEach(condition => {
          for (let index = 0; index < condition.subcontrols.length; index++) {
            const subcontrol = condition.subcontrols[index];

            const newNode: HierarchyNode = {
              controlName: null,
              parentControl: control.name,
              conditionValues: []
            };

            const sameControlandParentNode =
              this.hierarchyNodes.find(node => node.controlName === subcontrol && node.parentControl === control.name);

            if ( sameControlandParentNode === undefined) {
              newNode.controlName = subcontrol;
              newNode.conditionValues.push(...condition.values);
              this.hierarchyNodes.push(newNode);
            } else {
              sameControlandParentNode.conditionValues.push(...condition.values);
            }
          }
        });
      }
    });
  }

  private subscribeValueChanges(controls: Field[]) {
    controls.forEach(control => {
      this.formGroup.get(control.name).valueChanges.subscribe(newValue => {
        const oldValue = this.formGroup.value[control.name];
        const targetNode = this.hierarchy.find(node => node.name === control.name);

        if (control.conditions !== undefined) {
          for (let index = 0; index < targetNode.conditions.length; index++) {
            const condition = targetNode.conditions[index];

            // if old value is in hierarchy, reset controls
            if (condition.values.find(value => this.isEquivalent(value, oldValue)) !== undefined) {
              const newCondition = targetNode.conditions.find(cc => cc.values.find(value => this.isEquivalent(value, newValue)));

              condition.subcontrols.forEach(subcontrol => {
                // if new value has no condition or new value's condition is not the same, reset the value
                if (newCondition === undefined || newCondition.subcontrols.find(p => p === subcontrol) === undefined) {
                  this.formGroup.get(subcontrol).reset();
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

    const targetNodes = this.hierarchyNodes.filter(node => node.controlName === controlName);

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
