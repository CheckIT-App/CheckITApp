import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import firebase from 'firebase';
import { FormControl } from '@angular/forms';

import { IsID } from '../customValidators/ID';
import { ForgotPasswordModal } from '../pages/forgot-password/forgot-password.component';

@Injectable()
export class UserService {

    user_name = "";
    user2;
    constructor(public modalCtrl: ModalController) {
    }

    saveUserName(): Promise<string> {
        return Promise.resolve(this.user_name);
    }

    getCurrentUser(): Promise<any> {
        return Promise.resolve(this.user2);
    }

    getUser(): Promise<any> {
        let user_uid = localStorage.getItem('currentUser');
        let self = this;
        return Promise.resolve(firebase.database().ref('users_profiles/' + user_uid).once('value', function (snap) {
            console.log(snap.val());
            self.user2 = {
                username: snap.child('userName').val(),
                firstName: snap.child('firstName').val(),
                lastName: snap.child('lastName').val(),
                email: snap.child('email').val(),
                address: snap.child('address').val(),
                number: snap.child('mobile').val(),
                telephone: snap.child('telephone').val(),
                corporate_name: snap.child('corporate_name').val()
            }
        }));
    }

    getUserName(user_uid): Promise<any> {
        let self = this;
        return Promise.resolve(firebase.database().ref('users_profiles/' + user_uid).child('userName').once('value', function (snap) {
            console.log(snap.val());
            self.user_name = snap.val();
            return snap.val();
        }));
    }

    saveUser(firstName: string, lastName: string, password: string, userName: string, identity: number, type: string, corporate_name: string, numCorporation: number, mobile: string, telephone: string, email, address: string): Promise<any> {
        console.log("enter to save")
        console.log(firstName && lastName && password && userName && IsID.checkIDAsNumber(identity) == null && type && corporate_name && numCorporation && mobile && email && address);
        console.log(firstName + " " + lastName + " " + password + " " + userName + " " + IsID.checkIDAsNumber(identity) + " " + type + " " + numCorporation + " " + mobile + " " + email + " " + address);
        if (firstName && lastName && password && userName && IsID.checkIDAsNumber(identity) == null && type && (numCorporation || type == 'private') && mobile && email && address) {
            console.log("enter to if");
            var key = firebase.database().ref('users_profiles')
                .push({ firstName, lastName, display_name: firstName + " " + lastName, userName, password, identity, email, type, numCorporation, corporate_name, mobile, address, telephone, created: Date.now() }).key;
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

    isUserExists(name_corporation: string): Promise<any> {
        if (name_corporation != "") {
            return Promise.resolve(firebase.database().ref('users_profiles').orderByChild('corporate_name').equalTo(name_corporation).once('value').then((snap) => {
                let s;
                snap.forEach(function (childSnap) {
                    s = childSnap.key;
                });
                return s;
            }));
        }
    }

    searchUser(email: string, name_corporation: string): Promise<any> {//TODO add one more detail to the checking; maybe nameCorporation?
        return Promise.resolve(firebase.database().ref('users_profiles').orderByChild('email').equalTo(email).once('value').then((snap) => {
            let s;
            snap.forEach(function (childSnap) {
                s = childSnap.key;
            });
            return s;
        }));
    }

    updatePassword(key: string, password: string): Promise<any> {
        return Promise.resolve(firebase.database().ref('users_profiles/' + key).child('password').set(password));
    }

    updateUser(username: string, firstName: string, lastName: string, telephone, mobile: number, address: string, email: string):Promise<any> {
       return Promise.resolve( firebase.database().ref('users_profiles/' + localStorage.getItem('currentUser')).update({
            'userName': username,
            'firstName': firstName,
            'lastName': lastName,
            'email': email,
            'display_name': firstName + " " + lastName,
            'telephone': telephone,
            'mobile': mobile,
            'address': address
        }));
    }

    sendMailToManager() {

    }
}
