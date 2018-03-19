import { AlertController, ModalController, NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';


import { Camera } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CheckingCustomersPage } from '../checking-customers/checking-customers.component';
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
  existsCustomer: boolean = false;
  public customerUID;
  captureDataUrl: string;
  customer_name = "gtjyjyf";
  currentDealKey: string;
  error = "בדוק האם מלאת את כל השדות בערכים מתאימים.";
  imagename: number = 0;
  isNewDeal: boolean;
  maxDay: Date;//to ask about the range of the due-date
  message: string = "הצ'ק הוסף בהצלחה. אם ברצונך להוסיף צ'ק נוסף, מלא את השדות ולחץ ,'הוסף'";
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
    if (localStorage.getItem('language') == 'en') {
      document.dir = 'ltr';
      this.message = 'Check was added successfully. If you want to add one more check, fill the fields above and click \'ADD\' ';
      this.error = 'Check if all the fields are filled with valid values.'
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
            console.log(key);
            if (key != undefined) {//if the ID exists
              if (IsID.checkPassportAsNumber(this.addDealForm.value.passport) == null) {
                this.newDealService.isCustomerExists(parseInt(this.addDealForm.value.passport), "passport").then(rkey => {
                  this.newDealService.updateCustomerWithID(key, this.addDealForm.value.passport, "passport").then(succeed => {//update the profile with the passport
                    if (succeed == true && rkey != undefined && rkey != key) {//if the passport exists - delete from the DB
                      this.newDealService.removeCustomer(rkey);
                    }
                  });
                });
              }
            }
            else {//if ID doesn't exist
              console.log(this.addDealForm.value.passport + "***");
              this.newDealService.isCustomerExists(this.addDealForm.value.passport, "passport").then(pkey => {
                console.log(pkey);
                if (pkey != undefined)
                  this.newDealService.updateCustomerWithID(pkey, this.addDealForm.value.ID, "ID").then(h => { console.log(h) });//update the profile of passport with ID
              })
            }
          });
        }
      }
    }
  }

  customerExistsCallback(exists: number, ID: number, type: string): void {
    if (exists == undefined) {
      this.existsCustomer = false;
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
    else {
      this.customerUID = exists;
      this.existsCustomer = true;
      // this.newDealService.getCustomerName(this.customerUID).then(name => {
      // this.customer_name =name;
      //   console.log(name);
      //   console.log(this.customer_name);
      // });
    }
  }

  checkCustomer() {
    this.navCtrl.push(CheckingCustomersPage, { id: this.addDealForm.controls.ID.value, type: "ID" });
  }

  savePic() {
    //this.newDealService.savepic();
  }

  takePic(): void {
    //TODO enable taking 2 pictures of the check
    this.cameraPlugin.getPicture({
      quality: 95,
      destinationType: this.cameraPlugin.DestinationType.DATA_URL,
      sourceType: this.cameraPlugin.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.cameraPlugin.EncodingType.JPEG,
      //targetWidth: 500,
      //targetHeight: 500,
      saveToPhotoAlbum: true
    }).then(profilePicture => {
      this.captureDataUrl = 'data:image/jpeg;base64,' + profilePicture;
      this.imagename = Math.floor(Date.now() / 1000);
      this.newDealService.savepic(this.captureDataUrl, this.imagename).then(r => {
        // this.alertCtrl.create({
        //   title: 'Uploaded!        ' + r,
        //   subTitle: 'Picture is uploaded to Firebase',
        //   buttons: ['OK']
        // }).present();

      });
    }, error => {
      // Log an error to the console if something goes wrong.
      console.log("ERROR -> " + JSON.stringify(error));
    });
    console.log("Take a picture");
  }

  addCheck(): void {
    this.newDealService.saveCheck(this.customerUID,
      this.currentDealKey,
      parseInt(this.addDealForm.value.checkNumber),
      parseInt(this.addDealForm.value.sum),
      this.addDealForm.value.bank,
      parseInt(this.addDealForm.value.branch),
      this.addDealForm.controls.dueDate.value,
      this.imagename).then(res => {
        if (res == true) {
          let toast = this.toastCtrl.create({
            message: this.message,
            duration: 3000
          });
          toast.present();
          this.addDealForm.controls.checkNumber.reset();
          this.addDealForm.controls.sum.reset();
          this.addDealForm.controls.bank.reset();
          this.addDealForm.controls.branch.reset();
          this.addDealForm.controls.dueDate.reset();
          this.imagename = 0;
        }
      });

  }

  addDeal(): void {
    if (!((this.addDealForm.controls.passport.valid || this.addDealForm.controls.ID.valid)
      && this.addDealForm.controls.checkNumber.valid
      && this.addDealForm.controls.sum.valid
      && this.addDealForm.controls.bank.valid
      && this.addDealForm.controls.branch.valid
      && this.addDealForm.controls.dueDate.valid
      && this.imagename != 0
    /*&&this.customer_name*/)) {
      //TODO להוסיף הערות/הדגשות לשדות הריקים-הלא ולידיים
      console.log("Nice try!");
      let toast = this.toastCtrl.create({
        message: this.error,
        duration: 3000
      });
      toast.present();
    } else {
      if (this.isNewDeal) {
        this.addDealForm.value.ID = this.addDealForm.value.ID == "" ? null : parseInt(this.addDealForm.value.ID);
        this.addDealForm.value.passport = this.addDealForm.value.passport == "" ? null : parseInt(this.addDealForm.value.passport);
        this.newDealService.getCustomerName(this.customerUID).then(name => {
          this.newDealService.saveDeal(this.customerUID,
            this.addDealForm.value.ID,
            this.addDealForm.value.passport,
            //this.customer_name,
            parseInt(this.addDealForm.value.checkNumber),
            parseInt(this.addDealForm.value.sum),
            this.addDealForm.value.bank,
            parseInt(this.addDealForm.value.branch),
            this.addDealForm.controls.dueDate.value,
            this.imagename).then((res) => {
              console.log(res);
              if (res != "Error") {
                this.currentDealKey = res;
                this.isNewDeal = false;
                this.addCheck();
              }
            }).catch(e => { console.log(e) });

        })
      }
      else {
        this.addCheck();
      }
    }
  }

  navigateHome() {
    this.takePic = null;
    this.navCtrl.pop();
  }


}