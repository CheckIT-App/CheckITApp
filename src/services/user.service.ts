import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import firebase from 'firebase';
import { FormControl } from '@angular/forms';

import { IsID } from '../customValidators/ID';

@Injectable()
export class UserService {

    constructor(public modalCtrl: ModalController) {
    }

    saveUser(firstName: string, lastName: string, password: string, userName: string, identity: number, type: string, numCorporation: number, mobile: string, telephone: string, email, address: string): Promise<any> {
        console.log("enter to save")
        console.log(firstName && lastName && password && userName && IsID.checkIDAsNumber(identity) == null && type && numCorporation && mobile && email && address);
        console.log(firstName + " " + lastName + " " + password + " " + userName + " " + IsID.checkIDAsNumber(identity) + " " + type + " " + numCorporation + " " + mobile + " " + email + " " + address);
        if (firstName && lastName && password && userName && IsID.checkIDAsNumber(identity) == null && type && (numCorporation||type=='private') && mobile && email && address) {
            console.log("enter to if");
            var key = firebase.database().ref('users_profiles')
                .push({ firstName, lastName, display_name: firstName + " " + lastName, userName, password, identity, email, type, numCorporation, mobile, address, telephone, created: Date.now() }).key;
            firebase.database().ref("users_profiles").child(key).child("uid").set(key);
            return Promise.resolve(key);
        }
        return Promise.resolve(null);
    }

    checkUser(username: string, password: string): Promise<any> {
        console.log(username, password);
        if (username != "" && password != "") {
            return Promise.resolve(firebase.database().ref('users_profiles').orderByChild('userName').equalTo(username).once('value').then((snap) => {
                let s, uid;
                snap.forEach(function (childSnap) {
                    s = s || childSnap.child('password').val() == password;
                    if (s)
                        uid = childSnap.key;
                    else
                        uid = undefined;
                });
                return uid;
            }));
        }
    }

    searchUser(email: string): Promise<any> {
        return Promise.resolve(firebase.database().ref('users_profiles').orderByChild('email').equalTo(email).once('value').then((snap) => {
            let s;
            snap.forEach(function (childSnap) {
                s = childSnap.key;
            });
            return s;
        }));
    }
}
