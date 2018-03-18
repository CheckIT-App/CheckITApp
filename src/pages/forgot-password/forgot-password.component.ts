import { AlertController, NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginPage } from '../login/login.component';
import { StartPage } from '../start/start.component';
import { NewPasswordModal } from '../new-password/new-password.component';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html',
})

export class ForgotPasswordModal {

    cancel_text = "ביטול";
    detailsForm: FormGroup;
    message_details = "אנא ודא שהפרטים שהזנת נכונים";
    message_failed = "בקשתך נדחתה. בדוק אם כתובת המייל שהזנת תקינה";
    message_notrecognized = "הפרטים שהזנת אינם שמורים במערכת. "
    message_updated = "סיסמתך עודכנה. תוכל להכנס למערכת.";
    message_succeed = "שלח בקשה למנהל המערכת. אם לא תטופל בתוך יומיים שלח מייל זה שנית.";
    name_corporation = "";
    placeholder_password = "עדכן סיסמא חדשה";
    placeholder_password_auth = "אמת סיסמא ";
    problem_auth = "נסיון רישום על שם עסק קיים.";
    problem_fp = "המשתמש מנסה להכנס למערכת והוא לא רשום בה."
    register_text = "הרשם מחדש למערכת";
    send_text = "שלח מייל למנהל המערכת";
    save_text = "עדכן סיסמא";
    sender;
    sent: boolean = true;
    update_failed = "הסיסמאות לא זהות. הכנס שוב.";
    username;
    isAuth: boolean;

    constructor(public alertCtrl: AlertController, public emailComposer: EmailComposer, public formBuilder: FormBuilder, public navCtrl: NavController, public modalCtrl: ModalController, public userService: UserService, public viewCtrl: ViewController, public toastCtrl: ToastController, public navParams: NavParams) {
        this.detailsForm = formBuilder.group({
            emailAddress: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
            name: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.minLength(3)])]
        });
        if (localStorage.getItem('language') == 'en') {
            document.dir = 'ltr';
            this.message_details = "Please make sure you filled the inputs with right values";
            this.message_failed = "Your action failed. Check if the email address you have give is valid";
            this.message_notrecognized = "The details you have filled are not saved.";
            this.message_updated = "Your password was updated. You can login the system.";
            this.message_succeed = "Send request to the system manager. If you won't get response in 2 days send this email again."
            this.problem_auth = 'Register failed, the corporation exists.';
            this.placeholder_password = "enter new password";
            this.placeholder_password_auth = "authenticate your password";
            this.cancel_text = "cancel";
            this.send_text = "send email to the system manager";
            this.save_text = "update password";
            this.update_failed = "The passwords are not the same. Please enter again";
            this.register_text = "re-register";
        }

        this.isAuth = this.navParams.get('sender') == "authentication";
        this.name_corporation = this.detailsForm.value.name = this.navParams.get('corporate_name');
    }

    sendMail(from: string, to: string, name): Promise<boolean> {
        console.log(from + " " + to + " " + name);
        if (from && to && name) {
            let email = {
                // from: from,
                to: "firstcheckit@gmail.com",
                subject: this.isAuth ? 'name corporation: ' + this.name_corporation : "name: " + name,
                body: this.isAuth ? this.problem_auth : this.problem_fp,
                isHtml: true
            };
            // Send a text message using default options
            this.emailComposer.open(email, function () {
                this.sent = false;
            }).then(r => { return Promise.resolve(true); });

        }
        else {
            return Promise.resolve(false);
        }
    }

    globalFunc() {
        console.log(this.isAuth);
        if (!(this.detailsForm.controls.emailAddress.valid && (this.detailsForm.controls.name.valid))) {
            this.toastCtrl.create({ message: this.message_details, duration: 2500 }).present();
        }
        else {
            if (this.isAuth) {
                this.toastCtrl.create({ message: this.message_succeed, duration: 3000 }).present();
                this.sendMail(this.detailsForm.controls.emailAddress.value, "firstcheckit@gmail.com", this.detailsForm.controls.name.value).then(res => {
                    if (res && this.sent) {                       
                        this.dismiss();// TODO navigate to another page?
                        this.navCtrl.push(LoginPage);
                    }
                    else {
                        this.toastCtrl.create({ message: this.message_failed, duration: 2500 }).present();
                    }
                })
            }
            else {
                this.name_corporation = "null";
                this.userService.searchUser(this.detailsForm.controls.emailAddress.value, this.detailsForm.controls.name.value).then(res => {
                    console.log(res + " res search user");
                    this.userService.isUserExists(this.detailsForm.controls.name.value).then(res2 => {
                        console.log(res + " res is user exists");
                        if (res && res2 && res == res2) {
                            this.userService.getUserName(res).then(r => {
                                if (r) {
                                    this.userService.saveUserName().then(username => {
                                        if (username) {
                                            this.name_corporation = name;
                                            // console.log(res + " res   " + username);
                                            // this.sendMail("firstcheckit@gmail.com", this.detailsForm.controls.emailAddress.value, username).then(b => {
                                            //     if (b) {
                                            //         this.toastCtrl.create({ message: this.message_sentmail, duration: 3000 }).present();
                                            //         // this.dismiss();
                                            //         this.navCtrl.push(LoginPage);
                                            //     }
                                            //     else {
                                            //         this.toastCtrl.create({ message: this.message_failed, duration: 2500 }).present();
                                            //     }
                                            // })

                                            this.modalCtrl.create(NewPasswordModal, { key: res, username: username }).present();
                                        }
                                        else {
                                            this.toastCtrl.create({ message: this.message_failed, duration: 2500 }).present();
                                        }
                                    })
                                }
                                else {
                                    this.toastCtrl.create({ message: this.message_failed, duration: 2500 }).present();
                                }
                            })

                        }
                        else {
                            this.alertCtrl.create({
                                cssClass: 'alert',
                                title: this.message_notrecognized,
                                buttons: [
                                    {
                                        text: this.send_text,
                                        handler: () => {
                                            this.sendMail(this.detailsForm.value.emailAddress, "firstcheckit@gmail.com", this.detailsForm.controls.name.value).then(b => {
                                                if (b) {
                                                    this.toastCtrl.create({ message: this.message_succeed, duration: 3000 }).present();
                                                    this.dismiss();// TODO navigate to another page?
                                                }
                                            });
                                        }
                                    },
                                    {
                                        text: this.register_text,
                                        handler: () => {
                                            // this.dismiss();
                                            this.navCtrl.push(StartPage);
                                        }
                                    },
                                    {
                                        text: this.cancel_text,
                                        role: 'cancel'
                                    }
                                ]
                            }).present();
                        }
                    })
                })


            }
        }
    }

    dismiss(): void {
        this.viewCtrl.dismiss(null);
    }

}