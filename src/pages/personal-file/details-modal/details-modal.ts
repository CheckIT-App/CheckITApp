import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { Check } from '../../../models/checks';
import { status, checkStatus } from '../../share/enums';
import { sum } from '../../share/consts';
@Component({
  selector: 'page-DetailsModal',
  templateUrl: 'details-modal.html'
})
export class DetailsModalPage implements OnInit {

//members

  checkReturned: boolean;
  sum = sum;
  selectedCheck: Check;
  selectedCheckCopy: Check;

//constructor

  constructor(params: NavParams, public viewCtrl: ViewController) {

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
      if (this.selectedCheck.dueDate != null) {
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


