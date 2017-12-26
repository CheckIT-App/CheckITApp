import { Component, OnInit, OnChanges, Pipe } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import 'rxjs/Rx';

import { DealService } from '../../services/deals.service'
import { Check } from '../../models/checks';
import { Customer } from '../../models/customer';
import { Deal } from '../../models/deals';
import { DetailsModalPage } from '../personal-file/details-modal/details-modal';
import { checkStatus, status } from '../share/enums';
import { FilterStatusPipe } from '../share/filters';
import { Observable } from 'rxjs/Observable';

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

  //constructor

  constructor(public dealService: DealService, public modalCtrl: ModalController, public navCtrl: NavController) {

  }

  //functions

  getDeals() {//import Deals from service

    var self = this;

    self.dealService.getDeals().then(res => {
      //הקוד הזה לא עובד
      this.deals = res.filter(d => {
        return d.status == checkStatus.notPaid;
      });
      this.deals.forEach(d => d.checks.filter(c => {
        return c.status == checkStatus.notPaid;
      }))
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
      this.deals = this.deals.filter(d => {
        return d.status == checkStatus.notPaid;
      });
      this.deals.forEach(d => d.checks.filter(c => {
        return c.status == checkStatus.notPaid;
      }))

  }


  ngOnInit(): void {

    this.getDeals();

  }

  PastDueDateChecks() {
    let val = "d";
    this.deals = this.dealService.getDealsFromService();
    this.deals = this.deals.filter((item) => {
      console.log(item);
      return ((item.firstName + item.created).toLowerCase().indexOf(val.toLowerCase()) > -1);
    });


  }

  presentModal() {

    let modal = this.modalCtrl.create(DetailsModalPage, { selectedCheck: this.selectedCheck });
    modal.present();

  }

  save() {

    this.dealService.save(this.deals);
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

