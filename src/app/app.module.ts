import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { CheckingCustomersPage } from '../pages/checkingCustomers/checkingCustomers';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NewCheckPage } from '../pages/newCheck/newCheck';
import { PersonalFilePage } from '../pages/personalFile/personalFile';
import { RegisterPage } from '../pages/register/register';
import { FirebaseProvider } from '../providers/firebase/firebase';

@NgModule({
  declarations: [
    MyApp,
    CheckingCustomersPage,
    HomePage,
    LoginPage,
    NewCheckPage,
    PersonalFilePage,
    RegisterPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CheckingCustomersPage,
    HomePage,
    LoginPage,
    NewCheckPage,
    PersonalFilePage,
    RegisterPage
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider
  ]
})
export class AppModule {}
