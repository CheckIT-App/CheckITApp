import { AlertController, NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { IsID } from '../../customValidators/ID';
import { IsNumberValidator } from '../../customValidators/number';
import { IsRelevantDateValidator } from '../../customValidators/date';
import { LoginPage } from '../login/login.component';
import { UserService } from '../../services/user.service';


@Component({
    selector: 'page-updateUser',
    templateUrl: 'update-user.html',
    providers: [UserService]
})

export class UpdateUserPage {
    public detailsForm: FormGroup;
    direct = "ltr";
    corporate_name: string;
    currentUser;
    identityType: string;
    isPassport: boolean;
    message: string = 'הפרטים שהזנת עודכנו בהצלחה.';
    message_error: string = 'הפעולה נכשלה.';
    optionalIdentityType: string = "PASSPORT";
    username;
    firstname;
    lang;
    lastname;
    address;
    number;
    telephone;
    email;
    constructor(public navCtrl: NavController, public toastCtrl: ToastController, public translate: TranslateService, public navParams: NavParams, public formBuilder: FormBuilder, public userService: UserService) {
        this.detailsForm = formBuilder.group({
            username: ['', Validators.compose([Validators.required])],
            firstname: ['', Validators.compose([Validators.required, Validators.maxLength(15)])],
            lang:['',Validators.compose([Validators.required])],
            lastname: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
            email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
            number: ['', Validators.compose([Validators.required])],
            telephone: [''],//אם זה הולך לשנות גם ההכנסת עסקה
            address: ['', Validators.compose([Validators.required])]
        });
        this.currentUser = this.navParams.get('user');
        this.email = this.currentUser.email;
        this.number = this.currentUser.number;
        this.telephone = this.currentUser.telephone;
        this.username = this.currentUser.username;
        this.firstname = this.currentUser.firstName;
        this.lastname = this.currentUser.lastName;
        this.address = this.currentUser.address;
        this.corporate_name = this.currentUser.corporate_name;
        this.lang = localStorage.getItem('language');
        if (localStorage.getItem('language') == 'en') {
            document.dir = 'ltr';
            this.direct = "rtl";
            this.message = 'The details you have changed were updated successfuly.';
            this.message = 'Something was wrong.';
        }


    }
    ngOnInit() {
        this.userService.getUser().then(user => {
            console.log(user);
            this.userService.getCurrentUser().then(user2 => {
                console.log(user2);
                this.detailsForm.value.address = user2.address;
                this.detailsForm.value.firstname = user2.firstName;
                this.detailsForm.value.lastname = user2.lastName;
                this.detailsForm.value.email = user2.email;
                this.detailsForm.value.telephone = user2.telephone;
                this.detailsForm.value.username = user2.username;
                this.detailsForm.value.number = user2.number;

            })
        });
    }

    changeLang() {
        console.log("enter" + this.lang);
        this.translate.use(this.lang);
        localStorage.setItem('language', this.lang);
        if (this.lang == "he") {
            document.dir = 'rtl';
            this.direct='ltr';
        }
        else {
            this.direct='rtl';
            document.dir = 'ltr';
        }
    }

    update() {
        this.detailsForm.value.address = this.detailsForm.controls.address.valid ? this.detailsForm.value.address : this.currentUser.address;
        this.detailsForm.value.firstname = this.detailsForm.controls.firstname.valid ? this.detailsForm.value.firstname : this.currentUser.firstName;
        this.detailsForm.value.lastname = this.detailsForm.controls.lastname.valid ? this.detailsForm.value.lastname : this.currentUser.lastName;
        this.detailsForm.value.email = this.detailsForm.controls.email.valid ? this.detailsForm.value.email : this.currentUser.email;
        this.detailsForm.value.telephone = this.detailsForm.controls.telephone.valid ? this.detailsForm.value.telephone : this.currentUser.telephone;
        this.detailsForm.value.username = this.detailsForm.controls.username.valid ? this.detailsForm.value.username : this.currentUser.username;
        this.detailsForm.value.number = this.detailsForm.controls.number.valid ? this.detailsForm.value.number : this.currentUser.number;
        this.userService.updateUser(this.detailsForm.value.username,
            this.detailsForm.value.firstname,
            this.detailsForm.value.lastname,
            this.detailsForm.value.telephone,
            this.detailsForm.value.number,
            this.detailsForm.value.address,
            this.detailsForm.value.email
        ).then(res => {
            // if (res) {
            this.toastCtrl.create({ message: this.message, duration: 2500 }).present();
            this.navCtrl.pop();
            //this.navCtrl.push(HomePage);
            //}
            // else{
            //     this.toastCtrl.create({ message: this.message_error, duration: 2500 }).present();                
            // }
        });
    }
}