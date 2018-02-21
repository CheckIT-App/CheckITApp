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

  passIsFilled: boolean;
  registerForm: FormGroup;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams, public toastCtrl: ToastController, public userService: UserService) {
    this.registerForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.maxLength(25), Validators.minLength(5)])],
      password1: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])],
      password2: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$')])],//to add validation?
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      number: ['', Validators.compose([Validators.required])],
      telephone: [''],//אם זה הולך לשנות גם ההכנסת עסקה
      address: ['', Validators.compose([Validators.required])]
    });
    if(localStorage.getItem('language')=='en')
      document.dir='ltr';
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
      && this.registerForm.controls.password1.valid
      && this.registerForm.controls.password2.valid
      && this.registerForm.value.password1 == this.registerForm.value.password2
      && this.registerForm.controls.email.valid
      && this.registerForm.controls.number.valid
      && this.registerForm.controls.address.valid
      && this.registerForm.controls.telephone.valid)) {
      //TODO להוסיף הערות/הדגשות לשדות הריקים-הלא ולידיים
      console.log("Nice try!");

    }
    else {
      console.log("enter to else");
      this.userService.saveUser(this.navParams.get("firstName"), this.navParams.get("lastName"), this.registerForm.value.password1, this.registerForm.value.username,
        this.navParams.get("identity"), this.navParams.get("corporationType"), this.navParams.get("numCorporation"), this.registerForm.value.number,
        this.registerForm.value.telephone, this.registerForm.value.email, this.registerForm.value.address).then(data => {
          console.log(data);
          if (data != null) {
            this.toastCtrl.create({ message: 'Welcome! You were added successfuly', duration: 2500 }).present().then(d => {
              console.log(data);
              localStorage.setItem('currentUser', data);
              this.navCtrl.setRoot(HomePage/*, { UID: data }*/);//to navigate to LoginPage? to welcome page?
            });
          }
        });
    }
  }
}