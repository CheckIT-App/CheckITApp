import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Http,HttpModule } from "@angular/http";
import { AlertController, LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import 'rxjs/add/operator/toPromise';

import { ForgotPasswordModal } from '../forgot-password/forgot-password.component';
import { IsID } from '../../customValidators/ID';
import { LoginPage } from '../login/login.component';
import { RegisterPage } from '../register/register.component';
import { StartPage } from '../start/start.component';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html',
  providers: [StartPage]
})

export class AuthenticationPage {

  alert_message: string = "עסק זה כבר קיים במערכת. בחר כעת מה ברצונך לעשות:"
  alert_title: string = "הודעת מערכת";
  //firstName;
  cancel_text: string = "ביטול";
  fullName;
  identity: number;
  isPrivate: boolean;
  isExistsInList: boolean;
  // lastName;
  login_text: string = "כניסה למערכת";
  message_details = "אנא ודא שמלאת את כל השדות בערכים תקינים!";
  message_wait = "מאמת נתונים, אנא המתן";
  name_corporation: string;
  numCor;
  placeholder_name = "הכנס שם";
  placeholder_email = "הכנס כתובת דואר אלקטרוני";
  sendmail_text: string = "שלח הודעה למנהל המערכת";
  send_text = "שלח";
  problem_auth = "נסיון רישום על שם עסק קיים.";
  message_succeed = "שלח בקשה למנהל המערכת. אם לא תטופל בתוך יומיים שלח מייל זה שנית.";


  constructor(public alertCtrl: AlertController, public emailComposer: EmailComposer, public httpClient: HttpClient, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navCtrl: NavController, public strtPage: StartPage, public toastCtrl: ToastController, public userService: UserService, public navParams: NavParams) {
    this.isPrivate = navParams.get("corporationType") == 'private';
    this.isExistsInList = false;
    if (localStorage.getItem('language') == 'en') {
      document.dir = 'ltr';
      this.message_details = 'please make sure you entered all fields with valid values!';
      this.message_wait = ' authenticates, please wait';
      this.alert_message = 'This business already exists. choose what to do now:';
      this.alert_title = 'system notice';
      this.cancel_text = 'Cancel';
      this.login_text = 'Login';
      this.placeholder_email = 'enter your email address';
      this.placeholder_name = 'enter your name';
      this.sendmail_text = 'send mail to system administrator';
      this.send_text = 'send';
      this.problem_auth = 'Register failed, the corporation exists.';
      this.message_succeed = "Send request to the system manager. If you won't get response in 2 days send this email again."
    }

  }

  // sendMail(name: string, email: string) {
  //   console.log(name + " " + email);
  //   if()
  // }

  next() {

    if (IsID.checkIDAsNumber(this.identity) == null && /*this.firstName && this.lastName &&*/this.name_corporation && (this.numCor || this.isPrivate)) {
      this.userService.isUserExists(this.name_corporation).then(d => {
        console.log(d);
        if (d == undefined) {
          let loading = this.loadingCtrl.create({
            spinner: 'dots',
            content: this.message_wait,
            duration: 3000
          });
          loading.present();
          this.httpClient.get('http://exchangep.mof.gov.il/api/AppInfo/getExchanges/')
            .toPromise()
            .then((data: any[]) => {
              if (!this.isPrivate) {//corporation
                let i: number;
                for (i = 0; i < data.length; i++) {
                  if (data[i].NumCorporation == this.numCor && data[i].CorporateName == this.name_corporation) {
                    this.isExistsInList = true;
                    break;
                  }
                }
                if (this.isExistsInList && IsID.checkIDAsNumber(this.identity) == null && /*this.firstName && this.lastName*/this.name_corporation && this.numCor) {
                  this.navCtrl.push(RegisterPage, { corporationType: this.navParams.get("corporationType"), /*firstName: this.firstName, lastName: this.lastName,*/ identity: this.identity, name_corporation: this.name_corporation, numCorporation: this.numCor });
                }
                else {
                  this.toastCtrl.create({ message: this.message_details, duration: 2500 }).present();
                }
              }
              else {
                let branchId: number;
                let i: number;
                for (i = 0; i < data.length; i++) {
                  if (data[i].CorporateName == this.name_corporation) {
                    this.isExistsInList = true;
                    branchId = data[i].BranchId;
                    break;
                  }
                }
                if (branchId) {
                  this.httpClient.get('http://exchangep.mof.gov.il/api/AppInfo/getSpecExchange/0/' + branchId)
                    .toPromise()
                    .then((data: any[]) => {
                      if (data[0].CorManagerIdNumber == this.identity) {
                        //Verified User
                        // this.isExistsInList = true;
                        console.log("Verified User");
                        this.navCtrl.push(RegisterPage, { corporationType: this.navParams.get("corporationType"),/* firstName: this.firstName, lastName: this.lastName,*/ identity: this.identity, name_corporation: this.name_corporation, numCorporation: 0 });
                      }

                    })
                    .catch(ex => {
                      this.toastCtrl.create({ message: 'ERROR!', duration: 2500 }).present();
                      console.log(ex);
                      //throw ex;
                    });

                }
                if (!this.isExistsInList) {
                  this.toastCtrl.create({ message: this.message_details, duration: 2500 }).present();
                }
              }
            })
            .catch(ex => {
              this.toastCtrl.create({ message: 'ERROR!', duration: 2500 }).present();
              console.log(ex);
              //throw ex;
            });
        }
        else {
          this.alertCtrl.create({
            title: this.alert_title,
            message: this.alert_message,
            buttons: [
              {
                text: this.cancel_text,
                role: 'cancel',
              },
              {
                text: this.login_text,
                handler: () => {
                  this.navCtrl.pop();
                  this.navCtrl.push(LoginPage);
                }
              },
              {
                text: this.sendmail_text,
                handler: () => {
                  //TODO send mail to firstcheckit@gmail.com
                  //and what to do after?
                  // this.alertCtrl.create({
                  //   cssClass:'alert',
                  //   title: this.sendmail_text,
                  //   inputs: [
                  //     {
                  //       name: 'name',
                  //       placeholder: this.placeholder_name
                  //     },
                  //     {
                  //       name: 'email',
                  //       placeholder: this.placeholder_email,
                  //       type: 'email'
                  //     }
                  //   ],
                  //   buttons: [
                  //     {
                  //       text: this.send_text,
                  //       handler: data => {
                  //         this.sendMail(data.name, data.email);
                  //       }
                  //     },
                  //     {
                  //       text: this.cancel_text,
                  //       role: 'cancel'
                  //     }
                  //   ]
                  // }).present();
                  this.toastCtrl.create({ message: this.message_succeed, duration: 3000 }).present();
                  let email = {
                    // from: from,
                    to: "firstcheckit@gmail.com",
                    subject: 'name corporation: ' + this.name_corporation,
                    body: this.problem_auth,
                    isHtml: true
                  };
                  // Send a text message using default options
                  this.emailComposer.open(email, function () {
                    this.sent = false;
                  }).then(r => {
                    //this.navCtrl.pop();
                    this.navCtrl.setRoot(LoginPage);
                  })
                  // this.modalCtrl.create(ForgotPasswordModal, { sender: "authentication", corporate_name: this.name_corporation }).present();
                  console.log("send mail");
                }
              }
            ]
          }).present();
        }
      })
    }
    else
      this.toastCtrl.create({ message: this.message_details, duration: 2500 }).present();
  }
}