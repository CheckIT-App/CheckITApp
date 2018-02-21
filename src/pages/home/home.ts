import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

<<<<<<< HEAD
import { CheckingCustomersPage } from '../checking-customers/checking-customers.component';
import { NewCheckPage } from '../newCheck/newCheck';
import { PersonalFilePage } from '../personal-file/personal-file.component';
import { PastDueDatePage } from '../past-due-date/past-due-date.component';
=======
import { CheckingCustomersPage } from '../checking-customers/checking-customers';
import { NewDealPage } from '../new-deal/new-deal.component';
import { PersonalFilePage } from '../personal-file/personal-file';
>>>>>>> 00ba19031ed2a0677ea38b94e02a4869fb4d30e1

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
users=firebase.database().ref('users/-KrjqXsU6q1olWIeiXGA/name');

  constructor(public navCtrl: NavController) {

  }
  navigateNewDeal() {
    this.navCtrl.push(NewDealPage);
  }  

  navigateCheckCustomers(){
    this.navCtrl.push(CheckingCustomersPage);
  } 

  navigatePersonalFile(){
    this.navCtrl.push(PersonalFilePage);
  } 
  navigatePastDueDate(){
    this.navCtrl.push(PastDueDatePage);
  } 
}
