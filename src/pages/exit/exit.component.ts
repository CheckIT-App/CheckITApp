import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../login/login.component';

@Component({
  selector: 'exit',
  templateUrl: 'exit.html'
})
export class Exit {

  constructor(public navCtrl: NavController) {
    if(localStorage.getItem('language')=='en')
      document.dir='ltr';
  }

  Exit(){
    localStorage.removeItem('currentUser');
    this.navCtrl.push(LoginPage);
  }

}