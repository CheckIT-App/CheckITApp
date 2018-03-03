import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { Check } from '../../models/checks';
import { sum } from '../share/consts';
import { status, checkStatus } from '../share/enums';

@Component({
  selector: 'page-DetailsModal',
  templateUrl: 'details-modal.html'
})
export class Details implements OnInit {

  //members

  checkReturned: boolean;
  sum = sum;
  selectedCheck: Check;
  selectedCheckCopy: Check;
  direct = "ltr";

  //constructor

  constructor(params: NavParams, public viewCtrl: ViewController) {
    if (localStorage.getItem('language') == 'en') {
    document.dir = 'ltr';
      this.direct = "rtl"
    }
    this.selectedCheck = params.get('selectedCheck');

  }

  //functions

  cancel() {

    this.selectedCheck.bank = this.selectedCheckCopy.bank;
    this.selectedCheck.branch = this.selectedCheckCopy.branch;
    this.selectedCheck.dueDate = this.selectedCheckCopy.dueDate;
    this.selectedCheck.expiredOn = this.selectedCheckCopy.expiredOn;
    this.selectedCheck.id = this.selectedCheckCopy.id;
    this.selectedCheck.status = this.selectedCheckCopy.status;
    this.selectedCheck.sum = this.selectedCheckCopy.sum;

    this.viewCtrl.dismiss();

  }

  ngOnInit(): void {
    if (this.selectedCheck.status == checkStatus.returened)
      this.checkReturned = true;

    let copy = Object.assign({}, this.selectedCheck)
    this.selectedCheckCopy = copy;
  }

  ok() {

    this.selectedCheck.sum = parseInt(this.selectedCheck.sum.toString());
    this.selectedCheck.id = parseInt(this.selectedCheck.id.toString());
    this.selectedCheck.branch = parseInt(this.selectedCheck.branch.toString());

    if (this.checkReturned) {
      this.selectedCheck.status = checkStatus.returened;
      this.selectedCheck.expiredOn = null;
    }
    else
      if (this.selectedCheck.expiredOn != null) {
        this.selectedCheck.status = checkStatus.paid;
      }
      else {
        this.selectedCheck.status = checkStatus.notPaid;
      }
    if (this.selectedCheck != this.selectedCheckCopy) {
      this.selectedCheck.updateStatus = status.update;
    }

    this.viewCtrl.dismiss();
  }

}


