import { Component, OnInit, OnChanges } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import firebase from 'firebase';

import { CheckService } from '../../services/data/checks.service'
import { Check } from '../../pages/personalFile/checks';
import { Customer } from '../../pages/personalFile/customer';
import { Deal } from '../../pages/personalFile/deals';
import { DetailsModalPage } from './detailsModal';



@Component({
  selector: 'page-personalFile',
  templateUrl: 'personalFile.html',
  providers: [CheckService]
})
export class PersonalFilePage implements OnInit {

  selectedDeal: Deal;
  selectCheck: Check;
  title = "התיק האישי שלי";
  orderProp = "";


  deals: Deal[];
  checks: Check[];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController, private checkService: CheckService) {

  }

  ngOnInit(): void { // import Deals from data

    this.getDeals();

  }
  getDeals() {//import Deals from service

    this.deals = this.checkService.getDeals();
    this.checks = this.checkService.getChecks();

  }

  presentModal() {

    //console.log(this.selectCheck);
    let modal = this.modalCtrl.create(DetailsModalPage, { selectedCheck: this.selectCheck });
    modal.present();

  }


  trySave() {

    this.checkService.save(this.checks);
    this.selectedDeal = null;

  }

  cancel() {
    this.checks.forEach(c => {
      if (c.updateStatus != 'static') {
        c.checkStatus = c.updateStatus;
        c.updateStatus = 'static';
        c.dueDate = '';
      }
    });
    this.selectedDeal = null;
  }

  thisDeal(Deal) {//change selected Deal

    if (this.selectedDeal != Deal) {
      this.selectedDeal = Deal;
    }
    else {
      this.selectedDeal = null;
      console.log("null");
    }

  }

  thisCheck(Check) { //change selected check

    if (this.selectCheck) {
      this.checks.forEach(c => {
        if (c === this.selectCheck) {
          c.updateStatus = this.selectCheck.updateStatus;
          console.log(this.selectCheck.firstName);
        }
      });
    }
    this.selectCheck = Check;
    console.log(this.selectCheck.firstName);

  }

  getItems(ev: any) {//search Deals

    // Reset items back to all of the items
    this.getDeals();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {

      this.deals = this.deals.filter((item) => {
        return ((item.firstName + item.timeStamp).toLowerCase().indexOf(val.toLowerCase()) > -1);
      });


    }
    if (this.orderProp != "")
      this.sortBy();

  }
  sortBy() {

    { console.log(" Clicked!") }
    this.deals = this.sort(this.deals);

  }

  private sort(Deals: Deal[]) {

    if (Deals && this.orderProp) {
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


}
