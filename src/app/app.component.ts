import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';

import { HomePage } from '../pages/home/home.component';
import { LoginPage } from '../pages/login/login.component';
import { RegisterPage } from '../pages/register/register.component';
import { StartPage } from '../pages/start/start.component';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, translate: TranslateService) {
    firebase.initializeApp({
      apiKey: "AIzaSyAMKNoiaRQFFmPRttWwaEiYn82_9S24xyY",
      authDomain: "checkit-f199c.firebaseapp.com",
      databaseURL: "https://checkit-f199c.firebaseio.com",
      projectId: "checkit-f199c",
      storageBucket: "checkit-f199c.appspot.com",
      messagingSenderId: "55755262892"
    });
    platform.ready().then(() => {
      //localStorage.clear();
      //sessionStorage.clear();
     // localStorage.removeItem('language');//TO DELETE
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('he');

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      //translate.use('he');

      localStorage.removeItem('currentUser');//TO DELETE
      if (localStorage.getItem('currentUser') != null) 
        this.rootPage = HomePage;
      else
        this.rootPage = LoginPage;

      if (localStorage.getItem('language') != null)
        translate.use(localStorage.getItem('language'));
    });
  }
}

