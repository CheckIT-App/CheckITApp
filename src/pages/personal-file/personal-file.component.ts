import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import { Details } from '../details-modal/details-modal';
import { status } from '../share/enums';
import { FilterStatusPipe } from '../share/filters';
import { Check } from '../../models/checks';
import { Deal } from '../../models/deals';
import { DealService } from '../../services/deals.service';
import firebase from 'firebase';


@Component({
  selector: 'page-personalFile',
  templateUrl: 'personal-file.html',
  providers: [DealService],

})
export class PersonalFilePage implements OnInit {
  //#region members

  checks: Check[];
  checkRef: any;
  deals: Deal[] = [];
  orderProp = "";
  selectedCheck: Check;
  selectedDeal: Deal;
  status = "paid";
  title = "";
  okText = "אישור";
  cancelText = "בטל";
  searchText = "חפש";
  direct = "ltr";
  yesterday:Date;
  //#endregion
  //constructor

  //constructor

  constructor(public dealService: DealService, public modalCtrl: ModalController, public navCtrl: NavController) {
    if (localStorage.getItem('language') == 'en') {
      document.dir = 'ltr';
      this.okText = "ok";
      this.cancelText = "cancel";
      this.searchText = "search";
      this.direct = "rtl";
    }
  }

  //functions

  getDeals() {//import Deals from service

    var self = this;
    self.dealService.getDeals().then(function (res) {
      self.deals = res;
    });

    // self.dealService.trial().then(t=>{
    //   console.log(t);
    // })

  }

  getItems(ev: any) {//search Deals 
    this.yesterday= new Date();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
    
    //this.yesterday= new Date(this.yesterday).toDateString;

    console.log((this.yesterday.getFullYear().toString()+"-"+this.yesterday.getMonth().toString()+"-"+this.yesterday.getDate().toString()).toString());
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

    // getMetadata().then(img=>{


    // });
    // Create reference to the file whose metadata we want to retrieve

    // Get metadata properties
    // forestRef.getMetadata { metadata, error in
    //   if let error = error {
    //     // Uh-oh, an error occurred!
    //   } else {
    //     // Metadata now contains the metadata for 'images/forest.jpg'
    //   }
    // }

  }

  presentModal() {

    let modal = this.modalCtrl.create(Details, { selectedCheck: this.selectedCheck });
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
          if (a[this.orderProp] > b[this.orderProp]) {
            return -1;
          } else if ([b[this.orderProp] > a[this.orderProp]]) {
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

