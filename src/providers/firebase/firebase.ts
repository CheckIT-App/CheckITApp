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

  // constructor(public http: Http) {
  //   console.log('Hello FirebaseProvider Provider');
  // }
  constructor(){

  }

  saveCheck(firstName:string, lastName:string, ID:number, checkNumber:number, sum:number, bank:string, branch:number, dueDate:number) {
    if(dueDate>Date.now() && IsID.checkID(ID)!={"notID": true}){
      return firebase.database().ref('checks')
      .push({ firstName, lastName, ID, checkNumber, sum, bank, branch, dueDate });
    }
    console.log("ERROR");
  }

}
