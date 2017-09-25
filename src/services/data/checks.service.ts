import { Injectable } from '@angular/core';

import firebase from 'firebase';

import { Check } from '../../pages/personalFile/checks';
import { Customer } from '../../pages/personalFile/customer';
import { Deal } from '../../pages/personalFile/deals';

@Injectable()
export class CheckService {

    deals: Deal[];
    checks: Check[] = [
        {
            dealId: 'fghglhg',
            id: 111,
            checkStatus: 'לא שולם עדיין',
            updateStatus: 'static',
            dueDate:'2016-04-03',
            firstName: 'חוי',
            checkKey: 'ssssss',
            bank: "הפועלים",
            branch: 123,
            checkNumber: 234567,
            dealKey: "fghghg",
            sum: 123
        },
        {
            dealId: 'aafrraa',
            id: 111,
            checkStatus: 'לא שולם עדיין',            
            updateStatus: 'static',
            dueDate:"2018-02-01",
            firstName: 'ישראל',
            checkKey: 'ssssss',
            bank: "הפועלים",
            branch: 123,
            checkNumber: 234567,
            dealKey: "aaaa",
            sum: 123
        },
        {
            dealId: 'aaadfa',
            id: 111,
            checkStatus: 'לא שולם עדיין',
            updateStatus: 'static',
            dueDate:'2016-02-01',
            firstName: 'יעל',
            checkKey: 'ssssss',
            bank: "פאגי",
            branch: 123,
            checkNumber: 234567,
            dealKey: "aaaa",
            sum: 123
        }]




    getDeals(): Deal[] {

        if (this.deals == null) {
            this.deals = [
                {
                    changer_uid: "fsd",
                    costumer_uid: "dfg",
                    dealId: "fghghg",
                    status: "not complete",
                    timeStamp: "2016-02-01",
                    firstName: "bati"
                },
                {
                    changer_uid: "fsd",
                    costumer_uid: "key",
                    dealId: "aaaa",
                    status: "not complete",
                    timeStamp:"2015-07-03",
                    firstName: "debi"
                },
                {
                    changer_uid: "fsd",
                    costumer_uid: "key",
                    dealId: "sese",
                    status: "not complete",
                    timeStamp: '2017-03-01',
                    firstName: "avi"
                }
            ]

            this.getChecksfromData();
        }

        return this.deals;
    }
    getChecksfromData(): void {
        var thisPage = this;


        firebase.database().ref("deals/dedrede-HDCxsas")
            .once("value").then(function (deals) {
                console.log(deals);
                deals.forEach(function (deal) {
                    console.log(deal);
                    thisPage.deals.push({
                        changer_uid: deal.child("changer_uid").val(),
                        costumer_uid: deal.child("costumer_uid").val(),
                        dealId: deal.key,
                        firstName: 'אפי',//firebase.database().ref("customers_profiles/-KsiS_k8VIsFVUpu7PGh/firstName"),
                        status: deal.child("status").val(),
                        timeStamp: deal.child("create").val(),

                    })
                    deal.child("checks").forEach(function (childDataSnapshot) {
                        firebase.database().ref("checks/" + childDataSnapshot.val())
                            .once("value").then(function (check) {
                                console.log(check);
                                thisPage.checks.push({
                                    id: check.child("ID").val(),
                                    firstName: check.child("firstName").val(),
                                    dueDate: check.child("dueDate").val(),
                                    checkStatus: check.child("status").val(),
                                    updateStatus: 'static',
                                    dealId: check.child("dealID").val(),
                                    checkKey: check.key,
                                    bank: check.child("bank").val(),
                                    branch: check.child("branch").val(),
                                    checkNumber: check.child("checkNumber").val(),
                                    dealKey:deal.key ,
                                    sum: check.child("sum").val()
                                });
                            });
                    });

                });
            });
    }
    getChecks(): Check[] {
        return this.checks;
    }
    save(checks: Check[]) {
        checks.forEach(c => {
            if (c.updateStatus != 'static') {
                firebase.database().ref('checks/' + c.checkKey).update({
                    'status': c.checkStatus,
                    'dueDate':c.dueDate
                });


            }
        });
    }
}