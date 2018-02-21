import { Component, OnInit, OnChanges, Pipe } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { DealService } from '../../services/deals.service'
import { Check } from '../../models/checks';
import { Customer } from '../../models/customer';
import { Deal } from '../../models/deals';
import { DetailsModalPage } from './details-modal/details-modal';
import { status } from '../share/enums';
import { FilterStatusPipe } from '../share/filters';

@Component({
  selector: 'page-personalFile',
  templateUrl: 'personal-file.html',
  providers: [DealService],

})
export class PersonalFilePage implements OnInit {
//members

  checks: Check[];
  deals: Deal[] = [];
  orderProp = "";
  selectedCheck: Check;
  selectedDeal: Deal;
  title = "התיק האישי שלי";

//constructor

  constructor( public dealService: DealService, public modalCtrl: ModalController, public navCtrl: NavController) {
    if(localStorage.getItem('language')=='en')
      document.dir='ltr';
  }

//functions

  getDeals() {//import Deals from service

    var self = this;
    self.dealService.getDeals().then(function (res) {
      self.deals = res;
    });

  }

  getItems(ev: any) {//search Deals 

    this.deals = this.dealService.getDealsFromService();
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.deals = this.deals.filter((item) => {
        return ((item.firstName + item.created).toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
    if (this.orderProp != "")
      this.deals = this.sort();

  }

  ngOnInit(): void {

    this.getDeals();

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

