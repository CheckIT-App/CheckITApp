import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';

import firebase from 'firebase';
import { FormControl } from '@angular/forms';

import { IsID } from '../../customValidators/ID';
/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FirebaseProvider {
  dealID: number;

  // constructor(public http: Http) {
  //   console.log('Hello FirebaseProvider Provider');
  // }
  constructor(){

  }

  getDealID(){
    this.dealID=456;
    return this.dealID;
  }

  saveCheck(dealID: number, firstName:string, lastName:string, ID:number, checkNumber:number, sum:number, bank:string, branch:number, dueDate):Promise<number> {
    if(Date.parse(dueDate)>Date.now() && IsID.checkID(ID)!={"notID": true}){
      firebase.database().ref('checks')
      .push({ firstName, lastName, ID, checkNumber, sum, bank, branch, dueDate });
      return Promise.resolve(this.getDealID());
    }
    console.log("ERROR");
  }

}
