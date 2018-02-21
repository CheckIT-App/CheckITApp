import { AlertController,ModalController, NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';


import { Camera } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NewCustomerModal } from '../new-customer/new-customer';
import { IsID } from '../../customValidators/ID';
import { IsNumberValidator } from '../../customValidators/number';
import { IsRelevantDateValidator } from '../../customValidators/date';
import { NewDealService } from '../../services/new-deal.service';


@Component({
  selector: 'page-newDeal',
  templateUrl: 'new-deal.html',
  providers: [NewDealService]
})

//TODO change the strings to constants
export class NewDealPage {
  public addDealForm: FormGroup;
  public customerUID;
  currentDealKey: string;
  isNewDeal: boolean;
  maxDay: Date;//to ask about the range of the due-date
  message:string="הצ'ק הוסף בהצלחה. אם ברצונך להוסיף צ'ק נוסף, מלא את השדות ולחץ ,'הוסף'";
  minDay: Date;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public modalCtrl: ModalController, public formBuilder: FormBuilder, public newDealService: NewDealService,
    public toastCtrl: ToastController, public cameraPlugin: Camera) {
    this.isNewDeal = true;
    this.minDay = new Date();
    this.maxDay = new Date();
    this.minDay.setMonth(this.minDay.getMonth() - 6);
    this.maxDay.setFullYear(this.minDay.getFullYear() + 20);
    this.addDealForm = formBuilder.group({
      ID: ['', Validators.compose([Validators.required, IsNumberValidator.isValid, IsID.checkID])],
      passport: ['', Validators.compose([Validators.required, IsID.checkPassport])],
      checkNumber: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],//to add validation?
      sum: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],
      bank: ['', Validators.compose([Validators.required])],//to add validation?
      branch: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],//to add validation?
      dueDate: ['', Validators.compose([Validators.required, IsRelevantDateValidator.isValid])]
    });
    if(localStorage.getItem('language')=='en'){
           document.dir='ltr'; 
           this.message='Check was added successfully. If you want to add one more check, fill the fields above and click \'ADD\' ';
    }

  }

  isExists() {
    if (this.addDealForm.value.ID == "" || this.addDealForm.value.ID == null) {
      this.addDealForm.controls.ID.reset();
      if (this.addDealForm.value.passport != "" && this.addDealForm.value.passport != null && IsID.checkPassportAsNumber(this.addDealForm.value.passport) == null) {
        this.newDealService.isCustomerExists(parseInt(this.addDealForm.value.passport), "passport").then(result => {
          this.customerExistsCallback(result, parseInt(this.addDealForm.value.passport), "passport");
        });
      }
    }
    if (this.addDealForm.value.passport == "" || this.addDealForm.value.passport == null) {
      this.addDealForm.controls.passport.reset();
      if (this.addDealForm.value.ID != "" && this.addDealForm.value.ID != null && IsID.checkIDAsNumber(this.addDealForm.value.ID) == null) {
        this.newDealService.isCustomerExists(parseInt(this.addDealForm.value.ID), "ID").then(result => {
          this.customerExistsCallback(result, parseInt(this.addDealForm.value.ID), "ID");
        });
      }
    }
    else {
      if (this.addDealForm.value.ID != "" && this.addDealForm.value.passport != "" && this.addDealForm.value.ID != null && this.addDealForm.value.passport != null) {//
        if (IsID.checkIDAsNumber(this.addDealForm.value.ID) == null) {
          this.newDealService.isCustomerExists(parseInt(this.addDealForm.value.ID), "ID").then(key => {
            if (key != undefined) {//if the ID exists
              if (IsID.checkPassportAsNumber(this.addDealForm.value.passport) == null) {
                this.newDealService.isCustomerExists(parseInt(this.addDealForm.value.passport), "passport").then(rkey => {
                  this.newDealService.updateCustomerWithID(key, this.addDealForm.value.passport, "passport").then(succeed => {//update the profile with the passport
                    if (succeed == true && rkey != undefined) {//if the passport exists - delete from the DB
                      this.newDealService.removeCustomer(rkey);
                    }
                  });
                });
              }
            }
            else {//if ID doesn't exist
              this.newDealService.isCustomerExists(this.addDealForm.value.passport, "passport").then(pkey => {
                this.newDealService.updateCustomerWithID(pkey, this.addDealForm.value.ID, "ID");//update the profile of passport with ID
              })
            }
          });
        }
      }
    }
  }

  customerExistsCallback(exists: number, ID: number, type: string): void {
    if (exists == undefined) {
      let modal = this.modalCtrl.create(NewCustomerModal, { ID: ID, type: type });
      modal.onDidDismiss(key => {
        if (key != null)
          this.customerUID = key;
        else {
          this.addDealForm.controls.passport.reset();
          this.addDealForm.controls.ID.reset();
        }
      });
      modal.present();
    }
    else
      this.customerUID = exists;
  }

  takePic(): void {
    //TODO enable taking 2 pictures of the check
    console.log("Take a picture");
  }

  addCheck(): void {
    this.newDealService.saveCheck(this.customerUID,
      this.currentDealKey,
      parseInt(this.addDealForm.value.checkNumber),
      parseInt(this.addDealForm.value.sum),
      this.addDealForm.value.bank,
      parseInt(this.addDealForm.value.branch),
      this.addDealForm.controls.dueDate.value).then(res => {
        if (res == true) {
          let toast = this.toastCtrl.create({
            message: this.message,
            duration: 2500
          });
          toast.present();
          this.addDealForm.controls.checkNumber.reset();
          this.addDealForm.controls.sum.reset();
          this.addDealForm.controls.bank.reset();
          this.addDealForm.controls.branch.reset();
          this.addDealForm.controls.dueDate.reset();
        }
      });

  }

  addDeal(): void {
    if (!((this.addDealForm.controls.passport.valid || this.addDealForm.controls.ID.valid)
      && this.addDealForm.controls.checkNumber.valid
      && this.addDealForm.controls.sum.valid
      && this.addDealForm.controls.bank.valid
      && this.addDealForm.controls.branch.valid
      && this.addDealForm.controls.dueDate.valid)) {
      //TODO להוסיף הערות/הדגשות לשדות הריקים-הלא ולידיים
      console.log("Nice try!");

    } else {
      if (this.isNewDeal) {
        this.addDealForm.value.ID = this.addDealForm.value.ID == "" ? null : parseInt(this.addDealForm.value.ID);
        this.addDealForm.value.passport = this.addDealForm.value.passport == "" ? null : parseInt(this.addDealForm.value.passport);

        this.newDealService.saveDeal(this.customerUID,
          this.addDealForm.value.ID,
          this.addDealForm.value.passport,
          parseInt(this.addDealForm.value.checkNumber),
          parseInt(this.addDealForm.value.sum),
          this.addDealForm.value.bank,
          parseInt(this.addDealForm.value.branch),
          this.addDealForm.controls.dueDate.value).then((res) => {
            if (res != "Error") {
              this.currentDealKey = res;
              this.isNewDeal = false;
              this.addCheck();
            }
          });
      }
      else {
        this.addCheck();
      }
    }
  }


}