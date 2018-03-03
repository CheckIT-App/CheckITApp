import { Component, OnInit } from '@angular/core';
import {  NavParams, ViewController } from 'ionic-angular';

import { Check } from '../../../models/checks';
import { sum } from '../../share/consts';
import { status, checkStatus } from '../../share/enums';

@Component({
  selector: 'modal-BlockDetails',
  templateUrl: 'block-details-modal.html'
})
export class BlockDetails implements OnInit {

//members

  checkReturned: boolean;
  direct = "ltr";
  sum = sum;
  selectedCheck: Check;
  selectedCheckCopy: Check;

//constructor

  constructor(params: NavParams, public viewCtrl: ViewController) {

    this.selectedCheck = params.get('selectedCheck');
    if (localStorage.getItem('language') == 'en') {
      document.dir = 'ltr';
        this.direct = "rtl"
      }

  }

//functions

 
  ngOnInit(): void {
    if (this.selectedCheck.status == checkStatus.returened)
      this.checkReturned = true;

   
  }

  ok() {

   
    this.viewCtrl.dismiss();
  }

}


