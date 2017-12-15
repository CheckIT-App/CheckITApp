import { AlertController, NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';


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
  public addCheckForm: FormGroup;
  customerUID;
  currentDealKey: string;
  isNewDeal: boolean;
  maxDay: Date;//to ask about the range of the due-date
  minDay: Date;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public modalCtrl: ModalController, public formBuilder: FormBuilder, public newDealService: NewDealService,
    public toastCtrl: ToastController, public cameraPlugin: Camera) {
    this.isNewDeal = true;
    this.minDay = new Date();
    this.maxDay = new Date();
    this.minDay.setMonth(this.minDay.getMonth() - 6);
    this.maxDay.setFullYear(this.minDay.getFullYear() + 20);
    this.addCheckForm = formBuilder.group({
      ID: ['', Validators.compose([Validators.required, IsNumberValidator.isValid, IsID.checkID])],
      passport: ['', Validators.compose([Validators.required, IsID.checkPassport])],
      checkNumber: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],//to add validation?
      sum: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],
      bank: ['', Validators.compose([Validators.required])],//to add validation?
      branch: ['', Validators.compose([Validators.required, IsNumberValidator.isValid])],//to add validation?
      dueDate: ['', Validators.compose([Validators.required, IsRelevantDateValidator.isValid])]
    });
  }

  isExists() {
    if (this.addCheckForm.value.ID == "" || this.addCheckForm.value.ID == null) {
      this.addCheckForm.controls.ID.reset();
      if (this.addCheckForm.value.passport != "" && this.addCheckForm.value.passport != null && IsID.checkPassportAsNumber(this.addCheckForm.value.passport) == null) {
        this.newDealService.isCustomerExists(parseInt(this.addCheckForm.value.passport), "passport").then(result => {
          this.customerExistsCallback(result, parseInt(this.addCheckForm.value.passport), "passport");
        });
      }
    }
    if (this.addCheckForm.value.passport == "" || this.addCheckForm.value.passport == null) {
      this.addCheckForm.controls.passport.reset();
      if (this.addCheckForm.value.ID != "" && this.addCheckForm.value.ID != null && IsID.checkIDAsNumber(this.addCheckForm.value.ID) == null) {
        this.newDealService.isCustomerExists(parseInt(this.addCheckForm.value.ID), "ID").then(result => {
          this.customerExistsCallback(result, parseInt(this.addCheckForm.value.ID), "ID");
        });
      }
    }
    else {
      if (this.addCheckForm.value.ID != "" && this.addCheckForm.value.passport != "" && this.addCheckForm.value.ID != null && this.addCheckForm.value.passport != null) {//
        if (IsID.checkIDAsNumber(this.addCheckForm.value.ID) == null) {
          this.newDealService.isCustomerExists(parseInt(this.addCheckForm.value.ID), "ID").then(key => {
            if (key != undefined) {//if the ID exists
              if (IsID.checkPassportAsNumber(this.addCheckForm.value.passport) == null) {
                this.newDealService.isCustomerExists(parseInt(this.addCheckForm.value.passport), "passport").then(rkey => {
                  this.newDealService.updateCustomerWithID(key, this.addCheckForm.value.passport, "passport").then(succeed => {//update the profile with the passport
                    if (succeed == true && rkey != undefined) {//if the passport exists - delete from the DB
                      this.newDealService.removeCustomer(rkey);
                    }
                  });
                });
              }
            }
            else {//if ID doesn't exist
              this.newDealService.isCustomerExists(this.addCheckForm.value.passport, "passport").then(pkey => {
                this.newDealService.updateCustomerWithID(pkey, this.addCheckForm.value.ID, "ID");//update the profile of passport with ID
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
          this.addCheckForm.controls.passport.reset();
          this.addCheckForm.controls.ID.reset();
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
    this.newDealService.saveCheck(this.currentDealKey,
      parseInt(this.addCheckForm.value.checkNumber),
      parseInt(this.addCheckForm.value.sum),
      this.addCheckForm.value.bank,
      parseInt(this.addCheckForm.value.branch),
      this.addCheckForm.controls.dueDate.value).then(res => {
        if (res == true) {
          let toast = this.toastCtrl.create({
            message: 'Check was added successfully. If you want to add one more check, fill the fields above and click \'ADD\' ',
            duration: 2500
          });
          toast.present();
          this.addCheckForm.controls.checkNumber.reset();
          this.addCheckForm.controls.sum.reset();
          this.addCheckForm.controls.bank.reset();
          this.addCheckForm.controls.branch.reset();
          this.addCheckForm.controls.dueDate.reset();
        }
      });

  }

  addDeal(): void {
    if (!((this.addCheckForm.controls.passport.valid || this.addCheckForm.controls.ID.valid)
      && this.addCheckForm.controls.checkNumber.valid
      && this.addCheckForm.controls.sum.valid
      && this.addCheckForm.controls.bank.valid
      && this.addCheckForm.controls.branch.valid
      && this.addCheckForm.controls.dueDate.valid)) {
      //TODO להוסיף הערות/הדגשות לשדות הריקים-הלא ולידיים
      console.log("Nice try!");

    } else {
      if (this.isNewDeal) {
        this.addCheckForm.value.ID = this.addCheckForm.value.ID == "" ? null : parseInt(this.addCheckForm.value.ID);
        this.addCheckForm.value.passport = this.addCheckForm.value.passport == "" ? null : parseInt(this.addCheckForm.value.passport);

        this.newDealService.saveDeal(this.customerUID,
          this.addCheckForm.value.ID,
          this.addCheckForm.value.passport,
          parseInt(this.addCheckForm.value.checkNumber),
          parseInt(this.addCheckForm.value.sum),
          this.addCheckForm.value.bank,
          parseInt(this.addCheckForm.value.branch),
          this.addCheckForm.controls.dueDate.value).then((res) => {
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