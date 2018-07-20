import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { MaterialReactiveFormHelper, Field, FieldContent, ValidationMessage } from '../helpers/material-reactive-form.helper';
import { PINValidator } from '../validators/PIN.validator';

@Component({
  selector: 'app-user-detail-form',
  templateUrl: './user-detail-form.component.html',
  styleUrls: ['./user-detail-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class UserDetailFormComponent implements OnInit {
  userDetailForm: FormGroup;
  materialReactiveFormHelper = new MaterialReactiveFormHelper();
  result: object;

  controls: FieldContent[] = [{
    fullName: {
      value: 'Siriwasan',
      validation: Validators.required,
      validation_message: [
        { type: 'required', message: 'Full name is required' }
      ]
    },
    PIN: {
      value: '123',
      validation: Validators.compose([
          Validators.required,
          Validators.minLength(13),
          Validators.maxLength(13),
          PINValidator.validCheckDigit
        ]),
      validation_message: [
        { type: 'required', message: 'PIN is required' },
        { type: 'minlength', message: 'PIN must be at least 13 characters long'},
        { type: 'maxlength', message: 'PIN must be at least 13 characters long'},
        { type: 'validPIN', message: 'เลขบัตรประชาชนผิด' },
      ]
    },
    sex: {},
    dateOfBirth: {
      validation: Validators.required,
      validation_message: [
        { type: 'required', message: 'date of birth is required' }
      ]
    },
    maritalStatus: {},
    numberOfChild: {
      conditions: [
        [{parent: 'maritalStatus', value: 'Married'}],
        [{parent: 'maritalStatus', value: 'Divorce'}],
      ]
    },
    marriedDate: {
      conditions: [
        [{parent: 'maritalStatus', value: 'Married'}],
        [{parent: 'maritalStatus', value: 'Divorce'}],
      ]
    },
    divorceDate: {
      conditions: [
        [{parent: 'maritalStatus', value: 'Divorce'}],
      ]
    },
    loveAnimal: {
      value: 'Yes',
    },
    havePet: {
      value: 'Yes',
      conditions: [
        [{parent: 'loveAnimal', value: 'Yes'}],
      ]
    },
    kindOfPet: {
      conditions: [
        [{parent: 'havePet', value: 'Yes'}],
      ]
    },
    dog: {
      value: true,
      conditions: [
        [{parent: 'havePet', value: 'Yes'}],
      ]
    },
    cat: {
      value: false,
      conditions: [
        [{parent: 'havePet', value: 'Yes'}],
      ]
    },
    mouse: {
      conditions: [
        [{parent: 'havePet', value: 'Yes'}],
      ]
    },
    bird: {
      conditions: [
        [{parent: 'havePet', value: 'Yes'}],
      ]
    },
    favoriteFood: {
      value: 'Pizza',
      conditions: [
        [{parent: 'dog', value: true}, {parent: 'mouse', value: true}, {parent: 'sex', value: 'Female'}],
        [{parent: 'cat', value: true}, {parent: 'bird', value: true}],
      ]
    }
  }];

  constructor(private formBuilder: FormBuilder) {
    this.userDetailForm = this.materialReactiveFormHelper
                              .createMaterialReactiveForm(this.formBuilder, this.controls);
  }

  ngOnInit() {
  }

  submit() {
    this.result = {...this.userDetailForm.value};
  }

  clear() {
    this.userDetailForm.reset();
  }

  load() {
    this.userDetailForm.setValue(this.result);
  }

  checkValidation(controlName: string, validatonType: string): boolean {
    return this.userDetailForm.get(controlName).hasError(validatonType) &&
      (this.userDetailForm.get(controlName).dirty || this.userDetailForm.get(controlName).touched);
    // return true;
  }

  showControl(controlName: string) {
    return this.materialReactiveFormHelper.showControl(controlName);
  }

  getValidationMessage(controlName: string): ValidationMessage[] {
    return this.materialReactiveFormHelper.getValidationMessage(controlName);
  }
}
