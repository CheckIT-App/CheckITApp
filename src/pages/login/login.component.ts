import { Component } from '@angular/core';
import { ModalController, NavController, ToastController } from 'ionic-angular';

import { HomePage } from '../home/home.component';
import { ForgotPasswordModal } from '../forgot-password/forgot-password.component';
import { RegisterPage } from '../register/register.component';
import { StartPage } from '../start/start.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  username: string;
  message_valid:string="הפרטים שהזנת אינם נכונים.";
  message_filled:string="לא כל השדות מלאים. אנא ודא שמלאת את כל הפרטים";
  password: string;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public userService: UserService, public toastCtrl: ToastController) {
    if(localStorage.getItem('language')=='en'){
      document.dir='ltr';
      this.message_filled='Not all the inputs are filled. Please make sure you put all the details';
      this.message_valid='The details are not correct. Please check the inputs';
    }     
  }

  login() {
    if (this.username && this.password ) {
      this.userService.checkUser(this.username, this.password).then(res => {
        if (res) {
          this.navCtrl.push(HomePage);
          localStorage.setItem('currentUser', res);
        }
        else
          this.toastCtrl.create({ message:this.message_valid , duration: 2500 }).present();
      });
    }
    else
      this.toastCtrl.create({ message:this.message_filled , duration: 2500 }).present();
  }

  forgotPassword() {
    this.modalCtrl.create(ForgotPasswordModal).present();
  }

  navigateNewUser() {
    this.navCtrl.push(StartPage);
  }

}