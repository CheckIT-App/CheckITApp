import { AlertController, NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { IsID } from '../../customValidators/ID';
import { IsNumberValidator } from '../../customValidators/number';
import { IsRelevantDateValidator } from '../../customValidators/date';
import { NewDealService } from '../../services/new-deal.service';


@Component({
    selector: 'page-newCustomer',
    templateUrl: 'new-customer.html',
    providers: [NewDealService]
})
//TODO change the strings to constants
//אפשר להוסיף פונקציה שתבדוק האם כבר קיים לקוח בשם זהה ותציג את מספר הזהות שכבר קיים במערכת להתאמה 
//(כך לא תיוצר כפילות כי בלי הפונקציה הנ"ל לקוח שיש לו גם מספר דרכון וגם מספר זהות יוכל להופיע פעמיים - בכל פעם עם מספר זהות שונה)
export class NewCustomerModal {
    public addCustomerForm: FormGroup;
    customerID: string;
    identityType: string;
    isPassport: boolean;
    message_exists: string = 'הלקוח כבר קיים במערכת';
    optionalIdentityType: string = "PASSPORT";

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public toastCtrl: ToastController, public navParams: NavParams, public formBuilder: FormBuilder, public newDealService: NewDealService,
        public cameraPlugin: Camera) {
        this.addCustomerForm = formBuilder.group({
            identity: ['', Validators.compose([IsNumberValidator.isValid])],
            firstName: ['', Validators.compose([Validators.required, Validators.maxLength(15)])],
            lastName: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
        });
        this.customerID = navParams.get('ID');
        this.identityType = navParams.get('type');
        this.isPassport = this.identityType == "ID" ? false : true;
        this.optionalIdentityType = this.identityType == "ID" ? "PASSPORT" : "IDENTITY";
        this.addCustomerForm.controls.identity.setValidators(this.identityType == "ID" ? IsID.checkPassport : IsID.checkID);
        if (localStorage.getItem('language') == 'en') {
            document.dir = 'ltr';
            this.message_exists = 'This customer has been added already';
        }

    }

    isExists(): void {//הפונקציה הזו בודקת האם הסוג השני של האיידי כבר קיים במערכת. אם כן הלקוח כבכר קיים ואין צורך להוסיף אותו אלא רק א מספר הזהות הנוסף
        if ((this.optionalIdentityType == "ID" && IsID.checkIDAsNumber(this.addCustomerForm.value.identity) == null) || (this.optionalIdentityType == "passport" && IsID.checkPassportAsNumber(this.addCustomerForm.value.identity) == null)) {
            this.newDealService.isCustomerExists(parseInt(this.addCustomerForm.value.identity), this.optionalIdentityType).then((d) => {
                if (d != undefined) {
                    this.newDealService.updateCustomerWithID(d, this.customerID, this.identityType).then(res => {
                        if (res) {
                            let toast = this.toastCtrl.create({
                                message: this.message_exists,
                                duration: 2500
                            });
                            toast.present();
                            this.viewCtrl.dismiss(d);
                        }
                    });
                }
            });
        }
    }

    dismiss(): void {
        this.viewCtrl.dismiss(null);
    }

    addCustomer(): void {
        if (!(this.addCustomerForm.controls.firstName.valid && this.addCustomerForm.controls.lastName.valid)) {
            console.log("Nice try!");
        }
        else {
            this.newDealService.saveCustomer(this.identityType == "ID" ? this.customerID : this.addCustomerForm.value.identity,
                this.identityType == "ID" ? this.addCustomerForm.value.identity : this.customerID,
                this.addCustomerForm.value.firstName,
                this.addCustomerForm.value.lastName).then((data) => {
                    //TODO return the key - the uid of the customer===done
                    this.addCustomerForm.reset();
                    this.viewCtrl.dismiss(data);
                });
        }
    }

}