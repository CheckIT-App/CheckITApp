import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { CheckingCustomersPage } from '../pages/checking-customers/checking-customers.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NewCheckPage } from '../pages/newCheck/newCheck';
import { PersonalFilePage } from '../pages/personal-file/personal-file.component';
import { Details } from '../pages/details-modal/details-modal';
import { RegisterPage } from '../pages/register/register';
import { PastDueDatePage } from '../pages/past-due-date/past-due-date.component';

import { FirebaseProvider } from '../providers/firebase/firebase';
import { FilterStatusPipe } from '../pages/share/filters';
import { CustomerToCheck } from '../pages/checking-customers/customer-to-check-modal/customer-to-check-modal';
import { BlockDetails } from '../pages/checking-customers/block-details-modal/block-details-modal';
import { FCMService } from '../services/FCMService';

@NgModule({
  declarations: [
    MyApp,
    CheckingCustomersPage,
    HomePage,
    LoginPage,
    NewCheckPage,
    PersonalFilePage,
    RegisterPage,
    Details,
    BlockDetails,
    FilterStatusPipe,
    PastDueDatePage,
    CustomerToCheck,
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
    RegisterPage,
    Details,
    BlockDetails,
    PastDueDatePage,
    CustomerToCheck,
  ],
  providers: [
    Camera,
    FCM,
    FCMService,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FirebaseProvider
  ]
})
export class AppModule { }
