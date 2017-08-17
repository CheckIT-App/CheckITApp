import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  trySave(){
    console.log("enter to func");
    //var defaultDatabase = firebase.database();
//     var messageListRef = firebase.database().ref('users');
// var newMessageRef = messageListRef.push();
// newMessageRef.set({
//   'user_id': 'ada',
//   'text': 'The Analytical Engine weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves.'
// });

    firebase.database().ref().push().set({
      "name":"a",
      "gmail address":"a@a.com"
    })
  }

}
