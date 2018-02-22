import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { Http,HttpModule } from "@angular/http";
import { NavController, NavParams, ToastController } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';

import { IsID } from '../../customValidators/ID';
import { RegisterPage } from '../register/register.component';
import { StartPage } from '../start/start.component';

@Component({
  selector: 'page-authentication',
  templateUrl: 'authentication.html',
  providers: [StartPage]
})

export class AuthenticationPage {

  firstName;
  fullName;
  identity: number;
  isPrivate: boolean;
  isExistsInList: boolean;
  lastName;
  message_details = "אנא ודא שמלאת את כל השדות בערכים תקינים!";
  numCor;

  constructor(public httpClient: HttpClient, public navCtrl: NavController, public strtPage: StartPage, public toastCtrl: ToastController, public navParams: NavParams) {
    this.isPrivate = navParams.get("corporationType") == 'private';
    this.isExistsInList = false;
    if (localStorage.getItem('language') == 'en') {
      document.dir = 'ltr';
      this.message_details = 'please make sure you entered all fields with valid values!';
    }

  }

  next() {
    this.fullName = this.firstName + " " + this.lastName;
    console.log(this.firstName + "  " + this.lastName + "   " + this.identity);
    if (IsID.checkIDAsNumber(this.identity) == null && this.firstName && this.lastName && (this.numCor || this.isPrivate)) {
      this.httpClient.get('http://exchangep.mof.gov.il/api/AppInfo/getExchanges/')
        .toPromise()
        .then((data: any[]) => {
          if (!this.isPrivate) {
            let i: number;
            for (i = 0; i < data.length; i++) {
              if (data[i].NumCorporation == this.numCor) {
                this.isExistsInList = true;
                break;
              }
            }
            if (this.isExistsInList && IsID.checkIDAsNumber(this.identity) == null && this.firstName && this.lastName && this.numCor) {
              this.navCtrl.push(RegisterPage, { corporationType: this.navParams.get("corporationType"), firstName: this.firstName, lastName: this.lastName, identity: this.identity, numCorporation: this.numCor });
            }
            else {
              this.toastCtrl.create({ message: this.message_details, duration: 2500 }).present();
            }
          }
          else {
            let branchId: number;
            let i: number;
            for (i = 0; i < data.length; i++) {
              if (data[i].CorporateName == this.fullName) {
                this.isExistsInList = true;
                branchId = data[i].BranchId;
                break;
              }
            }
            if (branchId) {
              this.httpClient.get('http://exchangep.mof.gov.il/api/AppInfo/getSpecExchange/0/' + branchId)
                .toPromise()
                .then((data: any[]) => {
                  if (data[0].CorManagerIdNumber == this.identity) {
                    //Verified User
                    this.isExistsInList = true;
                    console.log("Verified User");
                    this.navCtrl.push(RegisterPage, { corporationType: this.navParams.get("corporationType"), firstName: this.firstName, lastName: this.lastName, identity: this.identity, numCorporation: 0 });
                  }

                })
                .catch(ex => {
                  this.toastCtrl.create({ message: 'ERROR!', duration: 2500 }).present();
                  console.log(ex);
                  throw ex;
                });
              if (!this.isExistsInList) {
                this.toastCtrl.create({ message: this.message_details, duration: 2500 }).present();
              }
            }
          }
        })
        .catch(ex => {
          this.toastCtrl.create({ message: 'ERROR!', duration: 2500 }).present();
          console.log(ex);
          //throw ex;
        });
    }

  }
}