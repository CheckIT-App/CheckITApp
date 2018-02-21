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
    public static isExistsInCustomers: boolean;
    public static status: eStatus;

    constructor(public modalCtrl: ModalController) {
    }

    saveDeal(customer_uid, customer_id: number, passport: number, checkNumber: number, sum: number, bank: string, branch: number, dueDate): Promise<string> {
        if (customer_uid != null && IsRelevantDateValidator.checkDate(dueDate) != { "notValidityDate": true } && (IsID.checkIDAsNumber(customer_id) != { "notValidID": true } || IsID.checkPassportAsNumber(passport) != { "notValidPassport": true })) {
            var key = firebase.database().ref('deals').push({ customer_uid, created: Date.now(), sum: 0, status: eStatus.notPaid }).key;
            firebase.database().ref("public_deals/" + key).set({ customer_uid, created: Date.now(), checks_sum: 0, status: eStatus.notPaid });
            firebase.database().ref('user_deals/' + key).set({ customer_uid, created: Date.now(), status: eStatus.notPaid });//TO CHANGE!!!! after doing register...
            return Promise.resolve(key);
        }
        return Promise.resolve("Error");
    }

    saveCheck(deal_key: string, id: number, sum: number, bank: string, branch: number, due_date): Promise<boolean> {
        if (IsRelevantDateValidator.checkDate(due_date) != { "notValidityDate": true }) {
            firebase.database().ref('deals').child(deal_key).child('sum').once('value', function (snap) {
                firebase.database().ref('deals').child(deal_key).child('sum').set(snap.val() + sum);
                firebase.database().ref('public_deals').child(deal_key).child('checks_sum').set(snap.val() + sum);
            });
            this.checkID = firebase.database().ref('checks')
                .push({ id, sum, bank, branch, due_date, deal_key, status: eStatus.notPaid, is_date_of: (Date.parse(due_date) <= Date.now()) }).key;
            firebase.database().ref('deals').child(deal_key).child('checks').push({ checkID: this.checkID });
            firebase.database().ref('user_deals').child(deal_key).child('checks').push({ checkID: this.checkID });
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

    isCustomerExists(ID: number, kind: string): Promise<any> {
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
            return Promise.resolve(firebase.database().ref('customers_profiles').orderByChild('passport').equalTo(ID).once('value').then((snap) => {
                let s;
                snap.forEach(function (childSnap) {
                    s = childSnap.key;
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
                .push({ cusID, passport, firstName, lastName, created: Date.now() }).key;
            firebase.database().ref("customers_profiles").child(key).child("uid").set(key);
            return Promise.resolve(key);
        }
        return Promise.resolve(null);
    }

    updateCustomerWithID(key, IDToUpdate, type): Promise<boolean> {
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

}
