import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Camera } from '@ionic-native/camera';

//import { eStatus } from '../status-enumaration';
import { MyApp } from './app.component';
import { CheckingCustomersPage } from '../pages/checking-customers/checking-customers';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NewDealPage } from '../pages/new-deal/new-deal.component';
import { NewCustomerModal } from '../pages/new-customer/new-customer';
import { PersonalFilePage } from '../pages/personalFile/personalFile';
import { RegisterPage } from '../pages/register/register';
import { NewDealService } from '../services/new-deal.service';
import { FirebaseProvider } from '../providers/firebase/firebase';

@NgModule({
  declarations: [
    //eStatus,
    MyApp,
    CheckingCustomersPage,
    HomePage,
    LoginPage,
    NewDealPage,
    NewCustomerModal,
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
    NewDealPage,
    NewCustomerModal,
    PersonalFilePage,
    RegisterPage
  ],
  providers: [
    Camera,
    NewDealService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider
  ]
})
export class AppModule {}
