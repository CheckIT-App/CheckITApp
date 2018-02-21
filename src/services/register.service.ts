import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import firebase from 'firebase';
import { FormControl } from '@angular/forms';

import { IsID } from '../customValidators/ID';
import { NewCustomerModal } from '../pages/new-customer/new-customer';

@Injectable()
export class RegisterService {

    typeOfCorporation;
    constructor(public modalCtrl: ModalController) {
    }

    // setTypeOfCorporation(value) {
    //     this.typeOfCorporation = value;
    // }

    // getTypeOfCorporation() {
    //     return this.typeOfCorporation;
    // }
}
