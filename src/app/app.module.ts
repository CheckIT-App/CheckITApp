import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Camera } from '@ionic-native/camera';

//import { eStatus } from '../status-enumaration';
import { MyApp } from './app.component';
import { CheckingCustomersPage } from '../pages/checking-customers/checking-customers';
import { DetailsModalPage } from '../pages/personal-file/details-modal/details-modal';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NewDealPage } from '../pages/new-deal/new-deal.component';
import { NewCustomerModal } from '../pages/new-customer/new-customer';
import { NewDealService } from '../services/new-deal.service';
import { PersonalFilePage } from '../pages/personal-file/personal-file';
import { RegisterPage } from '../pages/register/register';

import { FirebaseProvider } from '../providers/firebase/firebase';
import { FilterStatusPipe } from '../pages/share/filters';

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
    DetailsModalPage,
    FilterStatusPipe
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
    RegisterPage,
    DetailsModalPage
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
