import { Injectable } from '@angular/core';

import firebase from 'firebase';

import { Check } from '../models/checks';
import { Customer } from '../models/customer';
import { Deal } from '../models/deals';
import { status, checkStatus } from '../pages/share/enums'


@Injectable()
export class DealService {

//members

    deals: Deal[];
    promiseDeales: Promise<Deal>;

//functions

    getDeals(): Promise<Deal[]> {

        if (this.deals == null) {
            this.deals = [];
            var self = this;
            return Promise.resolve(self.getDealsfromData());
        }
        else {
            return Promise.resolve(this.deals);
        }
    }

    getDealsfromData(): Promise<Deal[]> {
        var self = this;

        try {
            firebase.database().ref("user_deals/-L-8MQsvFyH-ASAIZkx0")//TODO:user
                .once("value").then
                // (function (deals) {//TODO:user
                //     deals.forEach
                (function (deal) {
                    firebase.database().ref("customers_profiles/" + deal.child("customer_uid").val() + "/firstName")
                        .once("value").then(function (name) {
                            self.deals.push({
                                checks: [],
                                created: new Date(deal.child("created").val()).toLocaleDateString(),
                                customerUid: deal.child("customer_uid").val(),
                                dealKey: deal.key,
                                firstName: name.val(),
                                status: deal.child("status").val(),
                            });

                            var d = self.deals.pop();

                            deal.child("checks").forEach(function (checkId) {
                                firebase.database().ref("checks/" + checkId.child("checkID").val())
                                    .once("value").then(function (check) {
                                        d.checks.push({
                                            bank: check.child("bank").val(),
                                            branch: check.child("branch").val(),
                                            checkKey: check.key,
                                            dealKey: check.child("deal_key").val(),
                                            dueDate: check.child("due_date").val(),
                                            expiredOn: check.child("expired_on").val(),
                                            id: check.child("id").val(),
                                            isDateOf: check.child("is_dat_of").val(),
                                            status: check.child("status").val(),
                                            sum: check.child("sum").val(),
                                            updateStatus: status.notUpdate,
                                        });
                                    });
                            });

                            self.deals.push(d);
                        });
                });
            // });//TODO:user
            return Promise.resolve(self.deals);
        }

        catch (e) {
            return Promise.resolve(self.deals);
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
                        'isDateOf': c.isDateOf,
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
            firebase.database().ref('user_deals/' + d.dealKey).update({//TODO:user
                'status': dealStatus,
            });
        });
    }

    getDealsFromService(): Deal[] {
        return this.deals;
    }

}