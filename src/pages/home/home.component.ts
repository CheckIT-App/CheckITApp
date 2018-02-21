import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import firebase from 'firebase';

import { CheckingCustomersPage } from '../checking-customers/checking-customers.component';
import { PersonalFilePage } from '../personal-file/personal-file.component';
import { PastDueDatePage } from '../past-due-date/past-due-date.component';
import { NewDealPage } from '../new-deal/new-deal.component';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  users = firebase.database().ref('users/-KrjqXsU6q1olWIeiXGA/name');

  constructor(public navCtrl: NavController) {
    if(localStorage.getItem('language')=='en')
      document.dir='ltr';
  }
  
  navigateNewDeal() {
    this.navCtrl.push(NewDealPage);
  }

  navigateCheckCustomers() {
    this.navCtrl.push(CheckingCustomersPage);
  }

  navigatePersonalFile() {
    this.navCtrl.push(PersonalFilePage);
  }

  navigatePastDueDate(){
    this.navCtrl.push(PastDueDatePage);
  } 
}
