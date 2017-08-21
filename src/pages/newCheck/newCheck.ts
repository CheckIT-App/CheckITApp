import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IsNumberValidator } from '../../customValidators/number';

@Component({
  selector: 'page-newCheck',
  templateUrl: 'newCheck.html'
})
export class NewCheckPage {
  public addCheckForm:FormGroup;
  toDay:number;
  future:number;

  constructor(public navCtrl: NavController,public formBuilder:FormBuilder) {
      // this.addCheckForm=formBuilder.group({[firstName: ['',Validators.compose([Validators.required, Validators.maxLength(15)])],
      //                                       lastName: ['',Validators.compose([Validators.required, Validators.maxLength(20)])]})
      this.toDay=Date.now();
      this.future=this.toDay+100000000000;//to ask about the range of the due date!!!!!!!!!!!
         this.addCheckForm = formBuilder.group({
                firstName: ['', Validators.compose([Validators.required, Validators.maxLength(15)])],
                lastName: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
                ID: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],
                checkNumber: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],
                sum: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],
                bank: ['', Validators.compose([Validators.required])],
                branch: ['', Validators.compose([Validators.required])],
                dueDate: ['', Validators.compose([Validators.required])]
          });
          
  }

}