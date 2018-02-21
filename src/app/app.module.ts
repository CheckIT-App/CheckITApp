import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/share';

//import { eStatus } from '../status-enumaration';
import { AuthenticationPage } from '../pages/authentication/authentication.component';
import { CheckingCustomersPage } from '../pages/checking-customers/checking-customers';
import { DetailsModalPage } from '../pages/personal-file/details-modal/details-modal';
import { Exit } from '../pages/exit/exit.component';
import { ForgotPasswordModal } from '../pages/forgot-password/forgot-password.component';
import { HomePage } from '../pages/home/home.component';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login.component';
import { NewDealPage } from '../pages/new-deal/new-deal.component';
import { NewCustomerModal } from '../pages/new-customer/new-customer';
import { NewDealService } from '../services/new-deal.service';
import { PersonalFilePage } from '../pages/personal-file/personal-file';
import { RegisterPage } from '../pages/register/register.component';
import { StartPage } from '../pages/start/start.component';
import { UserService } from '../services/user.service';

import { FirebaseProvider } from '../providers/firebase/firebase';
import { FilterStatusPipe } from '../pages/share/filters';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    //eStatus,
    AuthenticationPage,
    MyApp,
    CheckingCustomersPage,
    DetailsModalPage,
    Exit,
    ForgotPasswordModal,
    HomePage,
    LoginPage,
    NewDealPage,
    NewCustomerModal,
    PersonalFilePage,
    RegisterPage,
    StartPage,
    FilterStatusPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AuthenticationPage,
    MyApp,
    CheckingCustomersPage,
    DetailsModalPage,
    ForgotPasswordModal,
    HomePage,
    LoginPage,
    NewDealPage,
    NewCustomerModal,
    PersonalFilePage,
    RegisterPage,
    StartPage
  ],
  providers: [
    Camera,
    NewDealService,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FirebaseProvider,
    UserService
  ]
})
export class AppModule { }
