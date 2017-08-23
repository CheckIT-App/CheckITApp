import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(public http: Http) {
    console.log('Hello FirebaseProvider Provider');
  }

  saveCheck(firstName:string, lastName:string, ID:number, checkNumber:number, sum:number, bank:string, branch:number, dueDate:Date) {
    return firebase.database().ref('checks')
      .push({ firstName, lastName, ID, checkNumber, sum, bank, branch, dueDate });
  }

}
