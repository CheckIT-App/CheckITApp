import { Component } from '@angular/core';
import { ModalController, NavController, ToastController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';

import { HomePage } from '../home/home.component';
import { ForgotPasswordModal } from '../forgot-password/forgot-password.component';
import { RegisterPage } from '../register/register.component';
import { StartPage } from '../start/start.component';
import { UserService } from '../../services/user.service';


// const mailTransport = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: "batihollander@gmail.com",
//     pass: "412412412",
//   },
// });

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  username: string;
  message_valid: string = "הפרטים שהזנת אינם נכונים.";
  message_filled: string = "לא כל השדות מלאים. אנא ודא שמלאת את כל הפרטים";
  password: string;

  constructor(public emailComposer: EmailComposer, public modalCtrl: ModalController, public navCtrl: NavController, public userService: UserService, public toastCtrl: ToastController) {
    if (localStorage.getItem('language') == 'en') {
      document.dir = 'ltr';
      this.message_filled = 'Not all the inputs are filled. Please make sure you put all the details';
      this.message_valid = 'The details are not correct. Please check the inputs';
    }
  }

  login() {
    if (this.username && this.password) {
      this.userService.checkUser(this.username, this.password).then(res => {
        if (res) {
          this.navCtrl.push(HomePage);
          localStorage.setItem('currentUser', res);
        }
        else
          this.toastCtrl.create({ message: this.message_valid, duration: 2500 }).present();
      });
    }
    else
      this.toastCtrl.create({ message: this.message_filled, duration: 2500 }).present();
  }

  forgotPassword() {
    this.modalCtrl.create(ForgotPasswordModal).present();
  }

  navigateNewUser() {
    this.navCtrl.push(StartPage);
  }


  try() {
    console.log("try");
    //   let mailOptions= {
    //     from: '"Krunal Lathiya" <batihollander@gmail.com>', // sender address
    //     to: "batihollander@gmail.com", // list of receivers
    //     subject:"subject", // Subject line
    //     text: "body", // plain text body
    //     html: '<b>NodeJS Email Tutorial</b>' // html body
    // };
    //   mailTransport.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message %s sent: %s', info.messageId, info.response);
    //        // res.render('index');
    //     });

//==========================================================================

    this.emailComposer.isAvailable().then((available: boolean) => {

      if (available) {
        //Now we know we can send
        let email = {
          to: 'batihollander@gmail.com',
          subject: 'Cordova Icons available',
          body: 'How are you? Nice greetings from Leipzig',
          isHtml: true
        };

        // Send a text message using default options
        this.emailComposer.open(email);
      }
    }).catch(e => {
      console.log(e);
    });

    let email = {
      to: 'batihollander@gmail.com',
      //  cc: 'erika@mustermann.de',
      //  bcc: ['john@doe.com', 'jane@doe.com'],
      //  attachments: [
      //    'file://img/logo.png',
      //    'res://icon.png',
      //    'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
      //    'file://README.pdf'
      //  ],
      subject: 'Cordova Icons',
      body: 'How are you? Nice greetings from Leipzig',
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }
}