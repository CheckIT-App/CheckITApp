import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';

import { LoginPage } from '../login/login.component';
import { UpdateUserPage } from '../update-user/update-user.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'exit',
  templateUrl: 'exit.html'
})
export class Exit {

  exit:boolean = false;
  constructor(public emailComposer: EmailComposer, public modalCtrl: ModalController, public navCtrl: NavController, public userService: UserService) {
    if (localStorage.getItem('language') == 'en')
      document.dir = 'ltr';
  }

  contactUs() {
    let email = {
      to: "firstcheckit@gmail.com"
    }
    this.emailComposer.open(email);
  }

  Exit() {
    localStorage.removeItem('currentUser');
    this.navCtrl.push(LoginPage);
  }

  updateDetails() {
    this.userService.getUser().then(u => {
      this.userService.getCurrentUser().then(user => {
        this.navCtrl.push(UpdateUserPage, { user: user });
      })
    })

    console.log("update");
  }

  focusExit() {
    console.log("focus exit");
  }

}