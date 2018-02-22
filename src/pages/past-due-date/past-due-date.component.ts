import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { Details } from '../details-modal/details-modal';
import { checkStatus, status } from '../share/enums';
import { FilterStatusPipe } from '../share/filters';
import { Check } from '../../models/checks';
import { Deal } from '../../models/deals';
import { DealService } from '../../services/deals.service'

@Component({
  selector: 'page-pastDueDate',
  templateUrl: 'past-due-date.html',
  providers: [DealService],

})
export class PastDueDatePage implements OnInit {
  //members

  checks: Check[];
  deals: Deal[] = [];
  orderProp = "";
  selectedCheck: Check;
  selectedDeal: Deal;
  title = "צ'קים שעבר זמן פירעונם";
  today = Date.now();
  l: any = localStorage.getItem('language');
  //constructor

  constructor(public dealService: DealService, public modalCtrl: ModalController) {
    if (localStorage.getItem('language') == 'en')
      document.dir = 'ltr';
  }

  //functions

  getDeals() {//import Deals from service

    var self = this;

    self.dealService.getDeals().then(res => {
      //הקוד הזה לא עובד\
      this.deals = res;
      console.log("1", this.deals);
      this.deals.map(d => {
        d.checks = d.checks.filter(c => {
          return c.isDateOf == true && c.status != checkStatus.paid;
        });

      });
      this.deals = this.deals.filter(d => {
        return d.checks.length != 0;
      });
    });


  }


  getItems(ev: any) {//search Deals 

    this.deals = this.dealService.getDealsFromService();
    let val = ev.target.value;
    console.log(val);
    if (val && val.trim() != '') {
      this.deals = this.deals.filter((item) => {
        return ((item.firstName + item.created).toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    if (this.orderProp != "")
      this.deals = this.sort();
    //הקוד עובד פה.
    this.PastDueDateChecks();

  }


  ngOnInit(): void {

    this.getDeals();

  }

  PastDueDateChecks() {

    this.deals.map(d => {
      d.checks = d.checks.filter(c => {
        return c.isDateOf == true;
      });

    });
    this.deals = this.deals.filter(d => {
      return d.checks.length != 0;
    });

    // if(d.checks.length==0){
    //  console.log(this.deals.findIndex(s=>s==d))
    //  this.deals.splice(this.deals.findIndex(s=>s==d));
    // }


  }

  presentModal() {

    let modal = this.modalCtrl.create(Details, { selectedCheck: this.selectedCheck });
    modal.present();

  }

  save() {

    this.dealService.save(this.deals);
    this.PastDueDateChecks();
    this.selectedDeal = null;

  }

  sort() {//sort the deals

    if (this.deals && this.orderProp) {
      return this.deals
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
    return this.deals;
  }

  thisDeal(Deal) {//change selected Deal

    if (this.selectedDeal != Deal) {
      this.selectedDeal = Deal;
    }
    else {
      this.selectedDeal = null;
    }

  }

  thisCheck(Check) { //change selected check

    if (this.selectedCheck) {
      this.deals.forEach(d =>
        d.checks.forEach(c => {
          if (c == this.selectedCheck) {
            c.updateStatus = this.selectedCheck.updateStatus;
          }
        }));
    }
    this.selectedCheck = Check;
    this.presentModal();

  }

}

