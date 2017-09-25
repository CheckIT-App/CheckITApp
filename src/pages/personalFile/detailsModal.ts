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
    alert.setTitle('שנה סטטוס');

    alert.addInput({
      type: 'radio',
      label: 'שולם',
      value: 'שולם',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: "צ'ק חזר",
      value: "צ'ק חזר",
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'לא שולם עדיין',
      value: 'לא שולם עדיין',
      checked: false
    });

    alert.addButton('בטל');
    alert.addButton({
      text: 'אישור',
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
      console.log(this.selectedCheck.updateStatus + result);
      this.sTime.open();

    }
    this.selectedCheck.checkStatus = result;
    

  }

}