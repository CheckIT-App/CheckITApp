import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { Check } from '../../pages/personalFile/checks';

@Component({
  selector: 'page-DetailsModal',
  templateUrl: 'detailsModal.html'
})
export class DetailsModalPage {

  @ViewChild('dateTime') sTime;

  selectedCheck: Check;
  testStatusRadioResult: any;
  testStatusRadioOpen: boolean;

  constructor(params: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController) {
    console.log('selectedCheck', params.get('selectedCheck'));
    this.selectedCheck = params.get('selectedCheck');
  }

  dismiss() {
    let data = { 'selectedCheck': this.selectedCheck };
    this.viewCtrl.dismiss(data);
  }
  openStart() {
  }

  changeStatusAlert() { //  alert for changing status of a check
    let alert = this.alertCtrl.create();
    alert.setTitle('Change Status');

    alert.addInput({
      type: 'radio',
      label: 'Paid',
      value: 'Paid',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Check Returned',
      value: 'Check Returned',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Not Paid Yet',
      value: 'not paid yet',
      checked: false
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.testStatusRadioOpen = false;
        this.testStatusRadioResult = data;
        this.changeStatus(this.testStatusRadioResult);
      }
    });
    alert.present();
  }

  changeStatus(result) {//change status of a check

    if (this.selectedCheck && result != this.selectedCheck.checkStatus&&this.selectedCheck.updateStatus=='static') {
      this.selectedCheck.updateStatus = this.selectedCheck.checkStatus;
      this.selectedCheck.checkStatus = result;
      console.log(this.selectedCheck.updateStatus + result);
      this.sTime.open();

    }

  }

}