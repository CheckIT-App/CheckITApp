import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController, NavParams, ToastController } from 'ionic-angular';

import { HomePage } from '../home/home.component'
import { PasswordValidator } from '../../customValidators/password';
import { UserService } from '../../services/user.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})

export class RegisterPage {

  address_valid: boolean = true;
  email_valid: boolean = true;
  firstname_valid: boolean = true;
  lastname_valid: boolean = true;
  message_welcome: string = "ברוך הבא לCheckIt! נרשמת בהצלחה";
  passIsFilled: boolean;
  registerForm: FormGroup;
  username_valid: boolean = true;
  password1_valid: boolean = true;
  password2_valid: boolean = true;


  mobile_valid: boolean = true;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams, public toastCtrl: ToastController, public userService: UserService) {
    this.registerForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(15), Validators.minLength(3)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(15), Validators.minLength(3)])],
      username: ['', Validators.compose([Validators.required, Validators.maxLength(25), Validators.minLength(5)])],
      password1: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])],
      password2: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])],//to add validation?
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      number: ['', Validators.compose([Validators.required])],
      telephone: [''],//אם זה הולך לשנות גם ההכנסת עסקה
      address: ['', Validators.compose([Validators.required])]
    });
    if (localStorage.getItem('language') == 'en') {
      document.dir = 'ltr';
      this.message_welcome = 'Welcome to CheckIT! You were added successfuly';
    }
console.log(this.navParams.get("name_corporation")+this.navParams.get("corporationType")+this.navParams.get("numCorporation"));
  }

  authPassword(): boolean {
    if (this.registerForm.value.password1 != "") {
      this.passIsFilled = true;
      if (this.registerForm.value.password2 != "") {
        if (this.registerForm.value.password1 == this.registerForm.value.password2)
          return true;
        else {
          this.registerForm.controls.password2.reset();
          console.log("NOT EQUAL");
        }
      }
      return false;
    }
  }

  register() {
    if (!((this.registerForm.controls.username.valid)
      && this.registerForm.controls.firstname.valid
      && this.registerForm.controls.lastname.valid
      && this.registerForm.controls.password1.valid
      && this.registerForm.controls.password2.valid
      && this.registerForm.value.password1 == this.registerForm.value.password2
      && this.registerForm.controls.email.valid
      && this.registerForm.controls.number.valid
      && this.registerForm.controls.address.valid
      && this.registerForm.controls.telephone.valid)) {
      //TODO להוסיף הערות/הדגשות לשדות הריקים-הלא ולידיים
      this.firstname_valid=this.registerForm.controls.firstname.valid,
      this.lastname_valid=this.registerForm.controls.lastname.valid,
      this.username_valid = this.registerForm.controls.username.valid;
      this.password1_valid = this.registerForm.controls.password1.valid;
      this.password2_valid = this.registerForm.controls.password2.valid || !this.passIsFilled;
      this.email_valid = this.registerForm.controls.email.valid;
      this.mobile_valid = this.registerForm.controls.number.valid;
      this.address_valid = this.registerForm.controls.address.valid;
      console.log(this.username_valid);
      console.log("Nice try!!!");

    }
    else {
      console.log("enter to else");
      this.userService.saveUser(this.registerForm.value.firstname, this.registerForm.value.lastname, this.registerForm.value.password1, this.registerForm.value.username,
        this.navParams.get("identity"), this.navParams.get("corporationType"),this.navParams.get("name_corporation"), this.navParams.get("numCorporation"), this.registerForm.value.number,
        this.registerForm.value.telephone, this.registerForm.value.email, this.registerForm.value.address).then(data => {
          console.log(data);
          if (data != null) {
            this.toastCtrl.create({ message: this.message_welcome, duration: 2500 }).present().then(d => {
              console.log(data);
              localStorage.setItem('currentUser', data);
              this.navCtrl.setRoot(HomePage/*, { UID: data }*/);//to navigate to LoginPage? to welcome page?
            });
          }
        });
    }
  }
}