import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { HierarchyHelper, Control } from '../helpers/hierarchy.helper';
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

  hierarchy: Control[] = [{
    name: 'maritalStatus', conditions: [{
      values: ['Married', 'Divorce'], subcontrols: [{
        name: 'numberOfChild'}, {
        name: 'loveAnimal', conditions: [{
          values: ['Yes', 'NotSure'], subcontrols: [{
            name: 'havePet', conditions: [{
              values: ['Yes'], subcontrols: [{
                name: 'kindOfPet'}]}]}]}]}]
    }]
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
    this.hierarchyHelper.initializeHierarchy(this.testForm, this.hierarchy);
  }

  ngOnInit() {
  }

  createForm() {
    this.testForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      PIN: ['', Validators.compose([
        Validators.required,
        PINValidator.validPIN
      ])],
      sex: null,
      dateOfBirth: null,
      maritalStatus: null,
      numberOfChild: null,
      loveAnimal: null,
      havePet: null,
      kindOfPet: this.formBuilder.group({
        dog: null,
        cat: null,
        mouse: null,
        bird: null,
      }),
      favoriteFood: null,
    });
  }

  submit() {
    // const i = Number(this.testForm.value.radioGroup1_2);
    // this.testForm.get('radioGroup1_2').setValue(i);
    // console.log(i);

    this.result = {...this.testForm.value};

    // const tmp = this.result['checkBoxGroup'];
    // delete this.result['checkBoxGroup'];
    // this.result['checkBox1'] = tmp.checkBox1;
    // this.result['checkBox2'] = tmp.checkBox2;
    // this.result['checkBox3'] = tmp.checkBox3;
  }

  clear() {
    this.testForm.reset();
  }

  load() {
    // this.result['checkBoxGroup'] = {
    //   checkBox1: this.result['checkBox1'],
    //   checkBox2: this.result['checkBox2'],
    //   checkBox3: this.result['checkBox3'],
    // };
    // delete this.result['checkBox1'];
    // delete this.result['checkBox2'];
    // delete this.result['checkBox3'];

    this.testForm.setValue(this.result);
  }

  checkValidation(controlName: string, validatonType: string): boolean {
    return this.testForm.get(controlName).hasError(validatonType) &&
      (this.testForm.get(controlName).dirty || this.testForm.get(controlName).touched);
    // return true;
  }
}