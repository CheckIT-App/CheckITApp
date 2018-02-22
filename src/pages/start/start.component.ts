import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationPage } from '../authentication/authentication.component';
import { MyApp } from '../../app/app.component';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
  providers: [RegisterService]
})

export class StartPage {
  lang;
  type;
  regSer: RegisterService;

  constructor( public navCtrl: NavController, public translate: TranslateService) {
    this.type = 'private';
    this.lang = 'he';
     // var x=require('../exit/exit.html');
  }

  changeLang() {
    console.log("enter"+this.lang);
    this.translate.use(this.lang);
    localStorage.setItem('language', this.lang);
    if (this.lang == "he") {
      document.dir = 'rtl';
    }
    else {
      document.dir='ltr';
    }
  }

  next() {
    this.navCtrl.push(AuthenticationPage, { corporationType: this.type });
  }
}