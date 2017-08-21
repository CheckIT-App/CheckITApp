import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

import { CheckingCustomersPage } from '../checkingCustomers/checkingCustomers';
import { NewCheckPage } from '../newCheck/newCheck';
import { PersonalFilePage } from '../personalFile/personalFile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
users=firebase.database().ref('users/-KrjqXsU6q1olWIeiXGA/name');

  constructor(public navCtrl: NavController) {

  }
  navigateNewCheck() {
    this.navCtrl.push(NewCheckPage);
  }  

  navigateCheckCustomers(){
    this.navCtrl.push(CheckingCustomersPage);
  } 

  navigatePersonalFile(){
    this.navCtrl.push(PersonalFilePage);
  } 
}
