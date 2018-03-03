import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

import { Details } from '../details-modal/details-modal';
import { checkStatus, openOption, status } from '../share/enums';
import { FilterStatusPipe } from '../share/filters';
import { CustomerToCheck } from './customer-to-check-modal/customer-to-check-modal';
import { Check } from '../../models/checks';
import { Deal } from '../../models/deals';
import { DealService } from '../../services/deals.service'
import { BlockDetails } from './block-details-modal/block-details-modal';



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
  notPaidDealsLength: number = 0;
  paidDeals: Deal[] = [];
  paidDealsLength: number = 0;
  pastDueDateDeals: Deal[] = [];
  pastDueDateDealsLength: number = 0;
  orderProp = "";
  selectedCheck: Check;
  selectedCheckStatus: checkStatus;
  selectedDeal: Deal;
  selectedOption: openOption;
  status="paid";
  title = "";
  okText = "אישור";
  cancelText = "בטל";
  searchText = "חפש";
  l: any = localStorage.getItem('language');
  //#endregion 

  //#region constructor
  constructor(public dealService: DealService, public modalCtrl: ModalController, public navCtrl: NavController, public alertCtrl: AlertController) {
    if (localStorage.getItem('language') == 'en') {
      document.dir = 'ltr';
      this.okText = "ok";
      this.cancelText = "cancel";
      this.searchText = "search";
    }
  }
  //#endregion

  //#region lifecycle functions
  ngOnInit(): void {

    this.presentModalCustomerToCheck('הכנס מספר ת.ז. או דרכון', false);
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
    this.paidDeals.forEach(d => {
      this.paidDealsLength += d.checks.length;
    });

    this.notPaidDeals.map(d => {
      d.checks = d.checks.filter(c => {
        return c.status != checkStatus.paid && c.isDateOf != true;
      });
    });
    this.notPaidDeals = this.notPaidDeals.filter(d => {
      return d.checks.length > 0;
    });
    this.notPaidDeals.forEach(d => {
      this.notPaidDealsLength += d.checks.length;
    });

    this.pastDueDateDeals.map(d => {
      d.checks = d.checks.filter(c => {
        return c.status == checkStatus.returened;
      });
    });
    this.pastDueDateDeals = this.pastDueDateDeals.filter(d => {
      return d.checks.length > 0;
    });
    this.pastDueDateDeals.forEach(d => {
      this.pastDueDateDealsLength += d.checks.length;
    });
  }

  presentAlert(message) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: ['אישור']
    });
    alert.present();
    alert.onDidDismiss(() => {
      this.presentModalCustomerToCheck('אין נתונים על לקוח זה', false);

    })
  }

  presentModal() {//present model of a single check

    let modal = this.modalCtrl.create(BlockDetails, { selectedCheck: this.selectedCheck });
    modal.present();




  }

  presentModalCustomerToCheck(message, alert) {//present modal of a customer details for check his history 

    let modal = this.modalCtrl.create(CustomerToCheck, { messaging: message, alerting: alert });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.dealService.getDealsForCustomer(parseInt(data.id), data.type).then(res => {
          this.deals = res;
          if (res.length != 0) {
            console.log("r", res);
            this.title += " " + this.deals[0].firstName;
            this.orderDeals();
          }
          else {
            this.presentAlert('אין נתונים על לקוח זה');
          }
        }
        );
      }
      else {
        this.navCtrl.pop();
      }
    }

    )


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
