import { AlertController, NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginPage } from '../login/login.component';
import { IsID } from '../../customValidators/ID';
import { IsNumberValidator } from '../../customValidators/number';
import { IsRelevantDateValidator } from '../../customValidators/date';
import { UserService } from '../../services/user.service';


@Component({
    selector: 'page-new-password',
    templateUrl: 'new-password.html',
    providers: [UserService]
})

export class NewPasswordModal {
    public updatePasswordForm: FormGroup;
    key;
    username;
    message_details = "אנא ודא שהפרטים שהזנת נכונים";
    update_failed = "הסיסמאות לא זהות. הכנס שוב.";
    message_updated = "סיסמתך עודכנה. תוכל להכנס למערכת.";

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, public navParams: NavParams, public formBuilder: FormBuilder, public userService: UserService,
        public cameraPlugin: Camera) {
        this.updatePasswordForm = formBuilder.group({
            password: ['', Validators.compose([ Validators.minLength(8), Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])],
            password_auth: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])]
        });
        this.key = this.navParams.get('key');
        this.username = this.navParams.get('username');

        if (localStorage.getItem('language') == 'en') {
            document.dir = 'ltr';
            this.update_failed = "The passwords are not the same. Please enter again";
            this.message_updated = "Your password was updated. You can login the system.";
            this.message_details = "Please make sure you filled the inputs with right values";
        }

    }

    updatePassword() {
        if (this.updatePasswordForm.controls.password_auth.valid) {
            if (this.updatePasswordForm.value.password == this.updatePasswordForm.value.password_auth) {
                this.userService.updatePassword(this.key, this.updatePasswordForm.controls.password.value).then(res => {
                    //console.log(res);
                   // if (res) {
                        this.toastCtrl.create({ message: this.message_updated, duration: 2500 }).present();
                        this.dismiss();
                        //this.navCtrl.popAll();
                        this.navCtrl.push(LoginPage)
                   // }
                    // else {
                    //     this.toastCtrl.create({ message: this.update_failed, duration: 2500 }).present();
                    // }
                })
            }
            else {
                this.updatePasswordForm.controls.password_auth.reset();
                this.toastCtrl.create({ message: this.update_failed, duration: 2500 }).present();
            }
        }
        else {
            this.toastCtrl.create({ message: this.message_details, duration: 2500 }).present();
            this.updatePasswordForm.controls.password.reset();
            this.updatePasswordForm.controls.password_auth.reset();
        }
    }

    dismiss(): void {
        this.viewCtrl.dismiss(null);
    }

}