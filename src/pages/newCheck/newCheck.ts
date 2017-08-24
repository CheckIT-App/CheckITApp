import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FirebaseProvider } from '../../providers/firebase/firebase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IsID } from '../../customValidators/ID';
import { IsNumberValidator } from '../../customValidators/number';
import { IsRelevantDateValidator } from '../../customValidators/date';


@Component({
  selector: 'page-newCheck',
  templateUrl: 'newCheck.html'
})
export class NewCheckPage {
  public addCheckForm:FormGroup;
  toDay=Date.now();
  future=Date.now()+100000000000;
  selectedDate:number;
  show=true;

  constructor(public navCtrl: NavController,public formBuilder:FormBuilder, public firebaseData:FirebaseProvider) {
         this.addCheckForm = formBuilder.group({
                firstName: ['', Validators.compose([Validators.required, Validators.maxLength(15)])],
                lastName: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
                ID: ['', Validators.compose([Validators.required, IsNumberValidator.isValid,IsID.isValid])],
                checkNumber: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],//to add validation?
                sum: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],
                bank: ['', Validators.compose([Validators.required])],//to add validation?
                branch: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],//to add validation?
                dueDate: ['', Validators.compose([Validators.required,IsRelevantDateValidator.isValid])]
          });        
  }
  addCheck(){
    if (!this.addCheckForm.valid){
      console.log("Nice try!");
    } else {
      this.firebaseData.saveCheck(this.addCheckForm.value.firstName, 
      this.addCheckForm.value.lastName, 
        parseInt(this.addCheckForm.value.ID), 
        parseInt(this.addCheckForm.value.checkNumber),
        parseInt(this.addCheckForm.value.sum), 
        this.addCheckForm.value.bank, 
        parseInt(this.addCheckForm.value.branch),
        parseInt(this.addCheckForm.value.dueDate)).then( () => {
          this.addCheckForm.reset();
        });
    }  
  }

}