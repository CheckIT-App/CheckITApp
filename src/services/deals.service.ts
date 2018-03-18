import { Injectable } from '@angular/core';
import firebase from 'firebase';

import { Check } from '../models/checks';
import { Deal } from '../models/deals';
import { status, checkStatus, idOrPassport } from '../pages/share/enums'


@Injectable()
export class DealService {

    //members

    deals: Deal[];
    customerDeals: Deal[] = [];

    //functions

    getDeals(): Promise<Deal[]> {

        if (!this.deals) {
            this.deals = [];
            return this.getDealsfromData();
        }
        else {
            return Promise.resolve(this.deals);
        }
    }

    getDealsfromData(): Promise<Deal[]> {
        let self = this;

        try {
            //get data from firebase
            let userDeals = firebase.database()
                .ref("user_deals/" + localStorage.getItem('currentUser'))
                .once("value");
            let checks = firebase.database()
                .ref("checks")
                .once("value");
            //wait untill all the data comes
            return Promise.all([userDeals, checks])
                .then((res: any[]) => {
                    let deals = res[0];
                    let checks = res[1];
                    deals.forEach(function (deal) {
                        //put data to models
                        let newDeal = {
                            checks: [],
                            created: new Date(deal.child("created").val())
                                .toLocaleDateString(),
                            customerUid: deal.child("customer_uid").val(),
                            dealKey: deal.key,
                            firstName: deal.child("customer_name").val(),
                            status: deal.child("status").val(),
                        }
                        deal.child("checks")
                            .forEach(function (checkId) {
                                let check = checks.val()[checkId.val()];
                                let newCheck = {
                                    bank: check.bank,
                                    branch: check.branch,
                                    checkKey: checkId.val(),
                                    dealKey: check.deal_key,
                                    dueDate: check.due_date,
                                    expiredOn: check.expired_on,
                                    id: check.id,
                                    isDateOf: check.is_dat_of,
                                    status: check.status,
                                    sum: check.sum,
                                    updateStatus: status.notUpdate,
                                    imageUrl: check.imagename,
                                };
                                //check if there are checks that the due date past
                                if (new Date(newCheck.dueDate).getTime() <
                                    Date.now() && !newCheck.isDateOf) {
                                    newCheck.isDateOf = true;
                                    newCheck.updateStatus = status.update;
                                }
                                console.log(1, newCheck.dueDate);
                                console.log(2, new Date(newCheck.dueDate));
                                //push the check to the deal list
                                newDeal.checks.push(newCheck);
                            });
                        //push the checks to the user deals list
                        self.deals.push(newDeal);
                    });
                    //return the user deals
                    return self.deals;
                });
        }
        catch (e) {
            throw e;
        }
    }

    save(deals: Deal[]) {

        deals.forEach(d => {
            let dealStatus = checkStatus.paid;
            let sum = 0;
            d.checks.forEach(c => {
                if (c.updateStatus == status.update) {
                    c.updateStatus = status.notUpdate;
                    firebase.database().ref('checks/' + c.checkKey).update({
                        'status': c.status,
                        'due_date': c.dueDate,
                        'bank': c.bank,
                        'branch': c.branch,
                        'id': c.id,
                        'is_date_of': c.isDateOf,
                        'sum': c.sum,
                        'expired_on': c.expiredOn,

                    });
                }

                if (c.status != checkStatus.paid)
                    dealStatus = checkStatus.notPaid;
                sum += c.sum;
            });

            firebase.database().ref('public_deals/' + d.dealKey).update({
                'checks_sum': sum,
                'status': dealStatus,
            });

            firebase.database().ref('deals/' + d.dealKey).update({
                'sum': sum,
                'status': dealStatus,
            });
            firebase.database().ref('user_deals/' + localStorage.getItem('currentUser') + "/" + d.dealKey).update({
                'status': dealStatus,
            });
            firebase.database().ref('customer_deals/' + d.customerUid + "/" + d.dealKey).update({//TODO:user
                'status': dealStatus,
            });
        });
    }
    getDealsForCustomer(ID: number, kind: idOrPassport): Promise<any> {
        let self = this;
        self.customerDeals = [];
        try {
            if (kind == idOrPassport.id && ID) {
                let customer = firebase.database().ref('customers_profiles').orderByChild('cusID')
                    .equalTo(parseInt(ID.toString())).once('value');
                return Promise.all([customer]).then((snap) => {
                    let s;
                    console.log("s", snap);
                    snap[0].forEach(function (childSnap) {
                        s = childSnap.key;
                        console.log("sc", snap[0]);
                    })
                    return self.getCustomerDeals(s);
                })

            }

            if (kind == idOrPassport.passport && ID) {
                let customer = firebase.database().ref('customers_profiles').orderByChild('passport')
                    .equalTo(ID.toString()).once('value').then((snap) => {
                        console.log(snap[0]);
                        let s = "";
                        snap[0].forEach(function (childSnap) {
                            s = childSnap.key;
                            console.log(s);
                        })
                        console.log(s);
                        return self.getCustomerDeals(s);
                    })
            }
        }

        catch (e) {
            return Promise.resolve(0);
        }
    }

    getCustomerDeals(s) {
        try {
            let self = this;
            self.customerDeals = [];
            let deals = firebase.database().ref('customer_deals/' + s).once('value');
            let checks = firebase.database().ref('checks').once('value');
            return Promise.all([deals, checks]).then((res: any[]) => {
                let deals = res[0];
                let checks = res[1];
                deals.forEach(function (deal) {
                    console.log("d", deal.child("checks").val());
                    if (deal.child("checks").val()) {
                        let newDeal = {
                            checks: [],
                            created: new Date(deal.child("created").val()).toLocaleDateString(),
                            customerUid: s,
                            dealKey: deal.key,
                            firstName: deal.child("customer_name").val(),//TODO: Add to user_deals table
                            status: deal.child("status").val(),
                        }
                        deal.child("checks").forEach(function (checkId) {
                            console.log("c", checkId);
                            let check = checks.val()[checkId.val()];
                            let newCheck = {
                                bank: check.bank,
                                branch: check.branch,
                                checkKey: checkId.val(),
                                dealKey: check.deal_key,
                                dueDate: check.due_date,
                                expiredOn: check.expired_on,
                                id: check.id,
                                isDateOf: check.is_dat_of,
                                status: check.status,
                                sum: check.sum,
                                updateStatus: status.notUpdate,
                            };
                            if (new Date(newCheck.dueDate).getTime() < Date.now() && !newCheck.isDateOf) {
                                newCheck.isDateOf = true;
                                newCheck.updateStatus = status.update;
                            }
                            newDeal.checks.push(newCheck);
                        })
                        self.customerDeals.push(newDeal);
                    }
                });
                console.log(self.customerDeals);
                return self.customerDeals;
            })

        }
        catch (e) { }
    }

    getDealsFromService(): Deal[] {
        return this.deals;
    }

    getCustomerDealsFromService(): Deal[] {
        return this.customerDeals;
    }
    getImageFromStorage(imageUrl): Promise<any> {
        try {
            var url = firebase.storage().ref().child("images/" + imageUrl + ".jpg").getDownloadURL()
            return url;
        }
        catch (e) {
            console.log("no");
            return Promise.resolve(0);
        }
    }

     trial() {
    //     var token = 123;
    //     var checks = firebase.database()
    //         .ref("checks").orderByChild("user_uid").equalTo(localStorage.getItem('currentUser')).once('value');
    //     return Promise.all([checks]).then((snap) => {
    //         snap[0].forEach(c => {
                
    //             firebase.database().ref("checks/" + c.key)
    //                 .update({
    //                     'token': token,
    //                 });

    //             //backend.registerToken(token);
    //         });
    //     });
   }

}