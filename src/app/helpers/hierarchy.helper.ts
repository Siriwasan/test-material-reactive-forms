import { FormGroup } from '@angular/forms';

export interface Control {
  name: string;
  conditions?: Condition[]; // one control can have no condition or many conditions
}

export interface Condition {
  values: any[]; // difference conditions can have same result
  subcontrols: Control[]; // one result can have many control
}
interface HierarchyNode {
  controlName: string;
  parentControl: string;
  conditionValues: string;
}

export class HierarchyHelper {
  private formGroup: FormGroup;
  private hierarchy: Control[];
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

  private createHierarchyNodes(controls: any[], parentNode: HierarchyNode =
        {controlName: null, parentControl: null, conditionValues: null}) {
    controls.forEach(control => {
      const newNode: HierarchyNode = {
        controlName: control.name,
        parentControl: parentNode.parentControl,
        conditionValues: parentNode.conditionValues
      };

      this.hierarchyNodes.push(newNode);

      if (control.conditions !== undefined) {
        control.conditions.forEach(condition => {
          const childNode: HierarchyNode = {
            controlName: null,
            parentControl: control.name,
            conditionValues: condition.values
          };

          this.createHierarchyNodes(condition.subcontrols, childNode);
        });
      }
    });
  }

  private subscribeValueChanges(controls: any[]) {
    controls.forEach(control => {
      if (control.conditions !== undefined) {
        // subscribe value change to each control
        this.formGroup.get(control.name).valueChanges.subscribe(newValue => {
          const oldValue = this.formGroup.value[control.name];

          for (let index = 0; index < control.conditions.length; index++) {
            const condition = control.conditions[index];

            // if old value is in hierarchy, reset controls
            if (condition.values.find(o => this.isEquivalent(o, oldValue)) !== undefined) {
              // in case of new and old value are in same condition, don't reset control
              if (condition.values.find(o => this.isEquivalent(o, newValue)) !== undefined) {
                break;
              }

              // otherwise, reset previous condition controls
              condition.subcontrols.forEach(subcontrol => {
                this.formGroup.get(subcontrol.name).reset();
              });
            }
          }
        });
        // recursive subscribe to subcontrols
        control.conditions.forEach(consition => this.subscribeValueChanges(consition.subcontrols));
      }
    });
  }

  showHierarchy(controlName: string): boolean {
    if (this.isAlwayShow) {
      return true;
    }

    const targetNode = this.hierarchyNodes.find(node => node.controlName === controlName);

    // alway show if could not find control in hierarchy
    if (targetNode === undefined || targetNode.parentControl === null) {
      return true;
    }

    for (let index = 0; index < targetNode.conditionValues.length; index++) {
      const value = targetNode.conditionValues[index];

      if (this.isEquivalent(this.formGroup.get(targetNode.parentControl).value, value)) {
        return true;
      }
    }

    return false;
  }

  alwayShow(show: boolean = true) {
    this.isAlwayShow = show;
  }

  private isEquivalent(a: any, b: any): boolean {
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
