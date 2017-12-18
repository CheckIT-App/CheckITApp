import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

import { CheckingCustomersPage } from '../checking-customers/checking-customers';
import { NewDealPage } from '../new-deal/new-deal.component';
import { PersonalFilePage } from '../personal-file/personal-file';

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
}
