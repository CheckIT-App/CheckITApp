import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import firebase from 'firebase';
import { FormControl } from '@angular/forms';

import { eStatus } from '../status-enumaration';
import { IsID } from '../customValidators/ID';
import { IsRelevantDateValidator } from '../customValidators/date';
import { NewCustomerModal } from '../pages/new-customer/new-customer';

@Injectable()
export class NewDealService {
    checkID: string;
    customerID: number;
    customername: string = "";
    public static isExistsInCustomers: boolean;
    public static status: eStatus;

    constructor(public modalCtrl: ModalController) {
    }

    getCustomerName(customer_uid): Promise<any> {
        console.log("sdfghjk");
        let self = this;
        return Promise.resolve(firebase.database().ref('customers_profiles/'+customer_uid).child('display_name').once('value', function (snap) {
            console.log(snap.val());
            self.customername = snap.val();
            return snap.val();
        }));
    }

    saveDeal(customer_uid, customer_id: number, passport: number, /*customer_name,*/ checkNumber: number, sum: number, bank: string, branch: number, dueDate, imagename): Promise<string> {
        if (customer_uid != null && IsRelevantDateValidator.checkDate(dueDate) != { "notValidityDate": true } && (IsID.checkIDAsNumber(customer_id) != { "notValidID": true } || IsID.checkPassportAsNumber(passport) != { "notValidPassport": true })) {
            console.log (customer_uid != null && IsRelevantDateValidator.checkDate(dueDate) != { "notValidityDate": true } && (IsID.checkIDAsNumber(customer_id) != { "notValidID": true } || IsID.checkPassportAsNumber(passport) != { "notValidPassport": true }));
            // this.getCustomerName(customer_uid).then(customer_name => {
            //     console.log(customer_name);d
            //     if (customer_name) {
            //this.getCustomerName(customer_uid).then(res => {
                console.log(this.customername);
                var key = firebase.database().ref('deals').push({ customer_uid, created: Date.now(), sum: 0, status: eStatus.notPaid }).key;
                console.log(localStorage.getItem('currentUser'));
                firebase.database().ref("public_deals/" + key).set({ customer_uid, created: Date.now(), checks_sum: 0, status: eStatus.notPaid });
                firebase.database().ref("customer_deals/" + customer_uid + "/" + key).set({ user_uid: localStorage.getItem('currentUser'), created: Date.now(), status: eStatus.notPaid });//TODO 1)add user_uid. 2)ask chavi if she want me to change the key to identity/passport of customer instead of his uid
                firebase.database().ref('user_deals/' + localStorage.getItem('currentUser') + '/' + key).set({ customer_uid, customer_name: this.customername, created: Date.now(), status: eStatus.notPaid });//TO CHANGE!!!! after doing register...
                return Promise.resolve(key);
           // })

            // }
            // else {
            //     return Promise.resolve("Error");
        }
        // });


        // firebase.database().ref('customers_profiles').child(customer_uid).child('firstName').once('value', function (snap) {              
        //     this.customer_name = snap.val();
        //     console.log(this.customer_name);
        // }).then(data => {
        //     if (data) {
        //         var key = firebase.database().ref('deals').push({ customer_uid, created: Date.now(), sum: 0, status: eStatus.notPaid }).key;
        //         console.log(localStorage.getItem('currentUser'));
        //         firebase.database().ref("public_deals/" + key).set({ customer_uid, created: Date.now(), checks_sum: 0, status: eStatus.notPaid });
        //         firebase.database().ref("customer_deals/" + customer_uid + "/" + key).set({ user_uid: localStorage.getItem('currentUser'), created: Date.now(), status: eStatus.notPaid });//TODO 1)add user_uid. 2)ask chavi if she want me to change the key to identity/passport of customer instead of his uid
        //         firebase.database().ref('user_deals/' + localStorage.getItem('currentUser') + '/' + key).set({ customer_uid, customer_name: name, created: Date.now(), status: eStatus.notPaid });//TO CHANGE!!!! after doing register...
        //         return Promise.resolve(key);
        //     }
        //     else {
        //         return Promise.resolve("Error");
        //     }
        // }).catch(e=>{console.log(e)});
        //}
        else
            return Promise.resolve("Error");
    }

    saveCheck(customer_uid, deal_key: string, id: number, sum: number, bank: string, branch: number, due_date, imagename): Promise<boolean> {
        if (IsRelevantDateValidator.checkDate(due_date) != { "notValidityDate": true }) {
            firebase.database().ref('deals').child(deal_key).child('sum').once('value', function (snap) {
                firebase.database().ref('deals').child(deal_key).child('sum').set(snap.val() + sum);
                firebase.database().ref('public_deals').child(deal_key).child('checks_sum').set(snap.val() + sum);
                console.log(snap.val());
            });
            let customer_name = firebase.database().ref('customer_profiles/' + customer_uid).child('firstName') + " " + firebase.database().ref('customer_profiles/' + customer_uid).child('lastName');
            this.checkID = firebase.database().ref('checks')
                .push({ id, sum, bank, branch, due_date, deal_key, user_uid: localStorage.getItem('currentUser'), customer_uid, customer_name: customer_name, imagename, expired_on: "", status: eStatus.notPaid, is_date_of: (Date.parse(due_date) <= Date.now()) }).key;
            firebase.database().ref('deals').child(deal_key).child('checks/' + this.checkID).set(this.checkID);
            firebase.database().ref('user_deals').child(localStorage.getItem('currentUser')).child(deal_key).child('checks/' + this.checkID).set(this.checkID);
            firebase.database().ref('customer_deals').child(customer_uid).child(deal_key).child('checks/' + this.checkID).set(this.checkID);
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

    isCustomerExists(ID: number, kind: string): Promise<any> {
        console.log(ID + " " + kind);
        if (kind == "ID" && ID) {
            return Promise.resolve(firebase.database().ref('customers_profiles').orderByChild('cusID').equalTo(ID).once('value').then((snap) => {
                let s;
                snap.forEach(function (childSnap) {
                    s = childSnap.key;
                });
                return s;
            }));
        }
        if (kind == "passport" && ID) {
            console.log("enter to if");
            return Promise.resolve(firebase.database().ref('customers_profiles').orderByChild('passport').equalTo(ID).once('value').then((snap) => {
                let s;
                snap.forEach(function (childSnap) {
                    s = childSnap.key;
                    console.log(s);
                });
                return s;
            }));
        }
    }

    saveCustomer(cusID: number, passport: number, firstName: string, lastName: string): Promise<any> {
        cusID = IsID.checkIDAsNumber(cusID) != { "notValidID": true } ? cusID : null;
        passport = IsID.checkPassportAsNumber(passport) != { "notValidPassport": true } ? passport : null;
        if (cusID != null || passport != null) {
            var key = firebase.database().ref('customers_profiles')
                .push({ cusID, passport, firstName, lastName, display_name: firstName + " " + lastName, created: Date.now() }).key;
            firebase.database().ref("customers_profiles").child(key).child("uid").set(key);
            return Promise.resolve(key);
        }
        return Promise.resolve(null);
    }

    updateCustomerWithID(key, IDToUpdate, type): Promise<boolean> {
        console.log(key + " " + IDToUpdate + " " + type);
        if (type == "passport") {
            firebase.database().ref("customers_profiles").child(key).child("passport").set(IDToUpdate);
            return Promise.resolve(true);
        }
        if (type == "ID") {
            firebase.database().ref("customers_profiles").child(key).child("cusID").set(IDToUpdate);
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

    removeCustomer(keyToRemove): void {
        firebase.database().ref("customers_profiles").child(keyToRemove).remove();
    }

    //TODELETE
    savepic(captureDataUrl: any, filename): Promise<boolean> {
        if (captureDataUrl && filename) {
            let storageRef = firebase.storage().ref();
            // Create a reference to 'images/todays-date.jpg'
            const imageRef = storageRef.child(`images/${filename}.jpg`);
            return Promise.resolve(imageRef.putString(captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
                // return Promise.resolve(true);
            }));
        }
        //return Promise.resolve(false);
    }
}
