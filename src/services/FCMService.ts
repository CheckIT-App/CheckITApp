import { Injectable } from "@angular/core";
import { FCM } from '@ionic-native/fcm';
import { PastDueDatePage } from "../pages/past-due-date/past-due-date.component";
import { NavController, Events } from "ionic-angular";
import firebase from 'firebase';

@Injectable()
export class FCMService {
    // Constructor/s

    constructor(events: Events, private fcm: FCM) {
        var self = this;
        if (!document.URL.startsWith("http")) {
            //fcm.subscribeToTopic( topic, successCallback(msg), errorCallback(err) );
            //All devices are subscribed automatically to 'all' and 'ios' or 'android' topic respectively.
            //Must match the following regular expression: "[a-zA-Z0-9-_.~%]{1,900}".
            fcm.subscribeToTopic('topicExample');

            //fcm.getToken( successCallback(token), errorCallback(err) );
            //Keep in mind the function will return null if the token has not been established yet.
            fcm.getToken().then(token => {

                var checks = firebase.database()
                    .ref("checks").orderByChild("user_uid").equalTo(localStorage.getItem('currentUser')).once('value');
                return Promise.all([checks]).then((snap) => {
                    snap[0].forEach(c => {
                        alert(c);
                        firebase.database().ref("checks/" + c.key)
                            .update({
                                'token': token,
                            });

                        //backend.registerToken(token);
                    });
                });
            })
            // .once('value');
            //         return Promise.all([customer]).then((snap) => {
            //             let s;
            //             console.log("s",snap);
            //             snap[0].forEach(function (childSnap) {
            //                 s = childSnap.key;
            //                 console.log("sc",snap[0]);
            //             })
            //             return self.getCustomerDeals(s);
            //         })
            //fcm.onNotification( onNotificationCallback(data), successCallback(msg), errorCallback(err) )
            //Here you define your application behaviour based on the notification data.
            fcm.onNotification().subscribe(function (data) {
                if (data.wasTapped) {
                    //Notification was received on device tray and tapped by the user.
                    //alert(JSON.stringify(data));
                    console.log("Received in background");
                    this.navCtrl.push(PastDueDatePage);
                }
                else {
                    //Notification was received in foreground. Maybe the user needs to be notified.
                    events.publish("newNotification");
                    //alert(data);
                    alert(JSON.stringify("check id: "+data.id+"  " +"sum: "+data.sum));
                    console.log("Received in foreground");
                    //this.navCtrl.push(PastDueDatePage);
                    
                }
            });

            //fcm.onTokenRefresh( onTokenRefreshCallback(token) );
            //Note that this callback will be fired everytime a new token is generated, including the first time.
            fcm.onTokenRefresh().subscribe(token => {
                // alert(token);
                //backend.registerToken(token);
            });

            //fcm.unsubscribeFromTopic('topicExample');
        }
    }
}