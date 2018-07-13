import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { HierarchyHelper, Field } from '../helpers/hierarchy.helper';
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
  testForm: FormGroup;
  hierarchyHelper = new HierarchyHelper();
  result: object;

  testControl: Field[] = [{
    name: 'fullName',
    value: 'Siriwasan',
    validation: Validators.required
  }, {
    name: 'PIN',
    value: '123',
    validation: Validators.compose([
        Validators.required,
        PINValidator.validPIN
      ])
  }, {
    name: 'sex',
  }, {
    name: 'dateOfBirth',
  }, {
    name: 'maritalStatus',
    conditions: [{
      values: ['Married'],
      subcontrols: ['numberOfChild', 'marriedDate']
    }, {
      values: ['Divorce'],
      subcontrols: ['numberOfChild', 'marriedDate', 'divorceDate']
    }]
  }, {
    name: 'numberOfChild',
  }, {
    name: 'marriedDate',
  }, {
    name: 'divorceDate',
  }, {
    name: 'loveAnimal',
    conditions: [{
      values: ['Yes', 'NotSure'],
      subcontrols: ['havePet'],
    }]
  }, {
    name: 'havePet',
    conditions: [{
      values: ['Yes'],
      subcontrols: ['kindOfPet', 'dog', 'cat', 'mouse', 'bird']
    }]
  }, {
    name: 'dog',
  }, {
    name: 'cat',
    conditions: [{
      values: [true],
      subcontrols: ['favoriteFood']
    }]
  }, {
    name: 'mouse',
  }, {
    name: 'bird',
  }, {
    name: 'favoriteFood',
    value: 'Pizza'
  }];

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
    this.createForm();
    this.hierarchyHelper.initializeHierarchy(this.testForm, this.testControl);
  }

  ngOnInit() {
  }

  createForm() {
    this.testForm = this.formBuilder.group({});

    this.testControl.forEach(e => {
      this.testForm.addControl(e.name, this.formBuilder.control(e.value, e.validation));
    });
  }

  submit() {
    this.result = {...this.testForm.value};
  }

  clear() {
    this.testForm.reset();
  }

  load() {
    this.testForm.setValue(this.result);
  }

  checkValidation(controlName: string, validatonType: string): boolean {
    return this.testForm.get(controlName).hasError(validatonType) &&
      (this.testForm.get(controlName).dirty || this.testForm.get(controlName).touched);
    // return true;
  }
}
