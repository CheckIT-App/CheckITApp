import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { idOrPassport } from '../../share/enums';
import { DealService } from '../../../services/deals.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
    selector: 'page-customerToCheckModal',
    templateUrl: 'customer-to-check-modal.html',
    providers: [DealService],

})
export class CustomerToCheck {

    //#region properties
    id: number;
    message: string = "";
    type: idOrPassport;
    //#endregion

    //#region constructor
    constructor(params: NavParams, public viewCtrl: ViewController, public dealService: DealService, public alertCtrl: AlertController) {
        this.message = params.get('messaging');
        if (params.get('alerting') == true) {
            this.presentAlert();
        }
        
    }
    //#endregion

    //#region events
    ok() {

        let thisId = this.id;
        if (thisId && this.checkId(thisId)) {
            this.viewCtrl.dismiss({ type: idOrPassport.id, id: thisId });

        }
        else {
            if (thisId && this.checkPassport(thisId)) {
                console.log("passport");

                this.viewCtrl.dismiss({ type: idOrPassport.passport, id: thisId });
            }
            else {
                this.presentAlert();
            }
        }
    }
    //#endregion

    //#region function
    checkId(thisId: number) {
        let sum = 0;
        let check = thisId % 10;
        thisId = parseInt((thisId / 10).toString());
        for (let i = 0; i < 8; i++) {
            let d = thisId % 10;
            if (i % 2 == 0) {
                if (d * 2 < 10) {
                    sum += d * 2;
                }
                else {
                    sum += (d * 2) % 10 + parseInt(((d * 2) / 10).toString());
                }
            }
            else {
                sum += thisId % 10;
            }
            thisId = parseInt((thisId / 10).toString());
        }
        if (10 - (sum % 10) == check || (sum % 10 == 0 && check == 0)) {
            return 1;
        }
        return 0;
    }

    checkPassport(thisId: number) {
        let cnt = 0;
        while (thisId != 0) {
            thisId = parseInt((thisId / 10).toString());
            cnt++;
        }
        if (cnt == 9) {
            return 1;
        }
        return 0;

    }
    presentAlert() {
        let alert = this.alertCtrl.create({
            subTitle:this.message,
            buttons: ['אישור']
        });
        alert.present();
    }
    dismiss(){
        this.viewCtrl.dismiss();
    }
    //#endregion    
}
