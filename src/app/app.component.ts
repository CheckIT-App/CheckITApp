import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
 
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
     firebase.initializeApp({
     apiKey: "AIzaSyAMKNoiaRQFFmPRttWwaEiYn82_9S24xyY",
    authDomain: "checkit-f199c.firebaseapp.com",
    databaseURL: "https://checkit-f199c.firebaseio.com",
    projectId: "checkit-f199c",
    storageBucket: "checkit-f199c.appspot.com",
    messagingSenderId: "55755262892"
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    
  }
}

