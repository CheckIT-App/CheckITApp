import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationPage } from '../authentication/authentication.component';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})

export class StartPage {
  lang;
  type;

  constructor( public navCtrl: NavController, public translate: TranslateService) {
    this.type = 'private';
    this.lang = 'he';
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