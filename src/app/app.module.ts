import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { EmailComposer } from '@ionic-native/email-composer';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/share';

//import { eStatus } from '../status-enumaration';
import { AuthenticationPage } from '../pages/authentication/authentication.component';
import { Exit } from '../pages/exit/exit.component';
import { ForgotPasswordModal } from '../pages/forgot-password/forgot-password.component';
import { HomePage } from '../pages/home/home.component';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login.component';
import { PersonalFilePage } from '../pages/personal-file/personal-file.component';
import { Details } from '../pages/details-modal/details-modal';
import { NewDealPage } from '../pages/new-deal/new-deal.component';
import { NewCustomerModal } from '../pages/new-customer/new-customer';
import { NewPasswordModal } from '../pages/new-password/new-password.component';
import { NewDealService } from '../services/new-deal.service';
import { RegisterPage } from '../pages/register/register.component';
import { StartPage } from '../pages/start/start.component';
import { UpdateUserPage } from '../pages/update-user/update-user.component';
import { UserService } from '../services/user.service';
import { PastDueDatePage } from '../pages/past-due-date/past-due-date.component';

import { FirebaseProvider } from '../providers/firebase/firebase';
import { FilterStatusPipe } from '../pages/share/filters';
import { CustomerToCheck } from '../pages/checking-customers/customer-to-check-modal/customer-to-check-modal';
import { BlockDetails } from '../pages/checking-customers/block-details-modal/block-details-modal';
import { FCMService } from '../services/FCMService';
import { CheckingCustomersPage } from '../pages/checking-customers/checking-customers.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  //return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    //eStatus,
    AuthenticationPage,
    MyApp,
    CheckingCustomersPage,
    Exit,
    ForgotPasswordModal,
    HomePage,
    LoginPage,
    NewDealPage,
    NewCustomerModal,
    NewPasswordModal,    
    PersonalFilePage,
    RegisterPage,
    StartPage,
    Details,
    BlockDetails,
    FilterStatusPipe,
    PastDueDatePage,
    CustomerToCheck,
    UpdateUserPage
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
    ForgotPasswordModal,
    HomePage,
    LoginPage,
    NewDealPage,
    NewCustomerModal,
    NewPasswordModal,
    PersonalFilePage,
    RegisterPage,
    StartPage,
    Details,
    BlockDetails,
    PastDueDatePage,
    CustomerToCheck,
    UpdateUserPage
  ],
  providers: [
    Camera,
    EmailComposer,
    FCM,
    FCMService,
    ForgotPasswordModal,
    NewDealService,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FirebaseProvider,
    UserService
  ]
})
export class AppModule { }
