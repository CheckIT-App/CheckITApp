import { AlertController, NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';

@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html',
})

export class ForgotPasswordModal {
    emailAddress: string;

    constructor(public navCtrl: NavController, public userService: UserService, public viewCtrl: ViewController, public toastCtrl: ToastController, public navParams: NavParams) {
        if(localStorage.getItem('language')=='en')
            document.dir='ltr';
    }

    searchUser(): void {   // var mandrill = require('node-mandrill')('<your API Key>'); 
        this.userService.searchUser(this.emailAddress).then(res => {
            if (res) {
                // //TODO send mail...
                console.log(res);
                window.open('mailto:batihollander@gmail.com?subject=33&body=555');
                // window.location.href = "mailto:batihollander@gmail.com?subject=33&body=555";
                document.addEventListener('deviceready', function () {
                    // cordova.plugins.email is now available
                    console.log("ENTER TO DEVICE READY");
                }, false);
                // function sendEmail ( _name, _email, _subject, _message) {
                // mandrill('/messages/send', {
                //     message: {
                //         to: [{email: this.emailAddress , name:"d"}],
                //         from_email: 'noreply@yourdomain.com',
                //         subject: "s",
                //         text: "g"
                //     }
                // }, function(error, response){
                //     if (error) console.log( error );
                //     else console.log(response);
                // });
                // }
            }

            else
                //TODO toast...
                console.log("ERROR");
        });
    }

    dismiss(): void {
        this.viewCtrl.dismiss(null);
    }

}