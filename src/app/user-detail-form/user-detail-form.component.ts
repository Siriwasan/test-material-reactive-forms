import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { MaterialReactiveFormHelper } from '../helpers/material-reactive-form.helper';
import { PINValidator } from '../validators/PIN.validator';

@Component({
  selector: 'app-user-detail-form',
  templateUrl: './user-detail-form.component.html',
  styleUrls: ['./user-detail-form.component.scss'],
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

  controls = {
    fullName: {
      value: 'Siriwasan',
      validation: Validators.required
    },
    PIN: {
      value: '123',
      validation: Validators.compose([
          Validators.required,
          PINValidator.validPIN
        ])
    },
    sex: {},
    dateOfBirth: {},
    maritalStatus: {
      conditions: [{
        values: ['Married'],
        subcontrols: ['numberOfChild', 'marriedDate']
      }, {
        values: ['Divorce'],
        subcontrols: ['numberOfChild', 'marriedDate', 'divorceDate']
      }]
    },
    numberOfChild: {},
    marriedDate: {},
    divorceDate: {},
    loveAnimal: {
      conditions: [{
        values: ['Yes', 'NotSure'],
        subcontrols: ['havePet'],
      }]
    },
    havePet: {
      conditions: [{
        values: ['Yes'],
        subcontrols: ['kindOfPet', 'dog', 'cat', 'mouse', 'bird']
      }]
    },
    dog: {
      value: true
    },
    cat: {
      value: false,
      conditions: [{
        values: [true],
        subcontrols: ['favoriteFood']
      }]
    },
    mouse: {},
    bird: {},
    favoriteFood: {
      value: 'Pizza'
    }
  };

  validation_messages = {
    fullName: [
      { type: 'required', message: 'Full name is required' }
    ],
    PIN: [
      { type: 'required', message: 'PIN is required' },
      { type: 'PINlenght', message: 'PIN must be at least 13 characters long'},
      { type: 'validPIN', message: 'เลขบัตรประชาชนผิด' },
    ]
  };

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
}
