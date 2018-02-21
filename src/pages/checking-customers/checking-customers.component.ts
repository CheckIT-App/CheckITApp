import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import { Details } from '../details-modal/details-modal';
import { checkStatus, openOption, status } from '../share/enums';
import { FilterStatusPipe } from '../share/filters';
import { CustomerToCheck } from './customer-to-check-modal/customer-to-check-modal';
import { Check } from '../../models/checks';
import { Deal } from '../../models/deals';
import { DealService } from '../../services/deals.service'
import { BlockDetails } from './block-details-modal/block-details-modal';
import { Title } from '@angular/platform-browser/src/browser/title';



@Component({
  selector: 'page-checkingCustomers',
  templateUrl: 'checking-customers.html',
  providers: [DealService]
})
export class CheckingCustomersPage {

  //#region properties
  checks: Check[];
  deals: Deal[] = [];
  notPaidDeals: Deal[] = [];
  notPaidDealsLength: number;
  paidDeals: Deal[] = [];
  paidDealsLength: number;
  pastDueDateDeals: Deal[] = [];
  pastDueDateDealsLength: number;
  orderProp = "";
  selectedCheck: Check;
  selectedCheckStatus: checkStatus;
  selectedDeal: Deal;
  selectedOption: openOption;
  title = " עסקאות לקוח";
  //#endregion 

  //#region constructor
  constructor(public dealService: DealService, public modalCtrl: ModalController, public navCtrl: NavController) {

  }
  //#endregion

  //#region lifecycle functions
  ngOnInit(): void {

    this.presentModalCustomerToCheck('הכנס מספר ת.ז. או דרכון',false);
    //this.getDeals();

  }
  //#endregion

  //#region events
  onSave() {//save in server

    this.localSave();

    this.dealService.save(this.deals);
    this.selectedDeal = null;

  }

  onSearch(ev: any) {//search Deals 

    this.orderDeals();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.paidDeals = this.paidDeals.filter((item) => {
        return ((item.firstName + item.created).toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.notPaidDeals = this.notPaidDeals.filter((item) => {
        return ((item.firstName + item.created).toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.pastDueDateDeals = this.pastDueDateDeals.filter((item) => {
        return ((item.firstName + item.created).toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    if (this.orderProp != "")
      this.onSort();

  }

  onSort() {//sort the deals

    if (this.deals && this.orderProp) {
      this.paidDeals = this.sortDeals(this.paidDeals);
      this.notPaidDeals = this.sortDeals(this.notPaidDeals);
      this.pastDueDateDeals = this.sortDeals(this.pastDueDateDeals);
    }

  }


  onChangeDeal(Deal) {//change selected Deal

    if (this.selectedDeal != Deal) {
      this.selectedDeal = Deal;
    }
    else {
      this.selectedDeal = null;
    }

  }

  onChangeCheck(Check) { //change selected check

    if (this.selectedCheck) {
      this.deals.forEach(d =>
        d.checks.forEach(c => {
          if (c == this.selectedCheck) {
            c.updateStatus = this.selectedCheck.updateStatus;
          }
        }));
    }
    this.selectedCheck = Check;
    this.selectedCheckStatus = Check.status;
    this.presentModal();

  }

  onChangeOption(option: number) {
    if (this.selectedOption != option)
      this.selectedOption = option;
    else
      this.selectedOption = null;
  }
  //#endregion

  //#region functions
  // getDeals() {//import Deals from service

  //   var self = this;

  //   self.dealService.getDeals().then(res => {
  //     this.deals = res;
  //     this.orderDeals();
  //   });

  // }

  localSave() {//save changes for this page
    this.deals = [];
    this.paidDeals.forEach(d => {
      let deal = Object.assign({}, d);
      this.deals.push(deal);
    });
    this.notPaidDeals.forEach(d => {
      let deal = Object.assign({}, d);
      this.deals.push(deal);
    });
    this.pastDueDateDeals.forEach(d => {
      let deal = Object.assign({}, d);
      this.deals.push(deal);
    });
  }

  orderDeals() {//order the deals to thier list
    this.paidDeals = this.deals.map(x => Object.assign({}, x));
    this.notPaidDeals = this.deals.map(x => Object.assign({}, x));
    this.pastDueDateDeals = this.deals.map(x => Object.assign({}, x));

    this.paidDeals.map(d => {
      d.checks = d.checks.filter(c => {
        return c.status == checkStatus.paid;
      });

    });
    this.paidDeals = this.paidDeals.filter(d => {
      return d.checks.length > 0;
    });
    this.paidDealsLength = this.paidDeals.length;

    this.notPaidDeals.map(d => {
      d.checks = d.checks.filter(c => {
        return c.status != checkStatus.paid && c.isDateOf != true;
      });
    });
    this.notPaidDeals = this.notPaidDeals.filter(d => {
      return d.checks.length > 0;
    });
    this.notPaidDealsLength = this.notPaidDeals.length;

    this.pastDueDateDeals.map(d => {
      d.checks = d.checks.filter(c => {
        return c.status != checkStatus.paid && c.isDateOf == true;
      });
    });
    this.pastDueDateDeals = this.pastDueDateDeals.filter(d => {
      return d.checks.length > 0;
    });
    this.pastDueDateDealsLength = this.pastDueDateDeals.length;
  }

  presentModal() {//present model of a single check

    let modal = this.modalCtrl.create(BlockDetails, { selectedCheck: this.selectedCheck });
    modal.present();



  }

  presentModalCustomerToCheck(message,alert) {//present modal of a customer details for check his history 

    let modal = this.modalCtrl.create(CustomerToCheck, { messaging: message,alerting:alert });
    modal.present();
    modal.onDidDismiss(data => {
      this.dealService.getDealsForCustomer(parseInt(data.id), data.type).then(res => {
        if (res!=[]) {
          this.deals = res;
          this.title+=" "+this.deals[0].firstName;
          console.log("r", res);
          this.orderDeals();
        }
        else{
          this.presentModalCustomerToCheck('אין נתונים על לקוח זה',true);
        }
      });
    })

  }

  sortDeals(deals: Deal[]) {//sort the deals
    return deals
      .slice(0) // Make a copy
      .sort((a, b) => {
        if (a[this.orderProp] < b[this.orderProp]) {
          return -1;
        } else if ([b[this.orderProp] < a[this.orderProp]]) {
          return 1;
        } else {
          return 0;
        }
      });
  }
  //#endregion



}
