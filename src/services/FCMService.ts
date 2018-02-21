import { Injectable } from "@angular/core";
import { FCM } from '@ionic-native/fcm';

@Injectable()
export class FCMService {
// Constructor/s

    constructor(private fcm: FCM) {
        if(!document.URL.startsWith("http")) {
            //fcm.subscribeToTopic( topic, successCallback(msg), errorCallback(err) );
            //All devices are subscribed automatically to 'all' and 'ios' or 'android' topic respectively.
            //Must match the following regular expression: "[a-zA-Z0-9-_.~%]{1,900}".
            fcm.subscribeToTopic('topicExample');
            
            //fcm.getToken( successCallback(token), errorCallback(err) );
            //Keep in mind the function will return null if the token has not been established yet.
            fcm.getToken().then(token => {
                alert('The token: ' + token);
                //backend.registerToken(token);
            });

            //fcm.onNotification( onNotificationCallback(data), successCallback(msg), errorCallback(err) )
            //Here you define your application behaviour based on the notification data.
            fcm.onNotification().subscribe(function (data) {
                if (data.wasTapped) {
                    //Notification was received on device tray and tapped by the user.
                    alert(JSON.stringify(data));
                    console.log("Received in background");
                } 
                else {
                    //Notification was received in foreground. Maybe the user needs to be notified.
                    alert(JSON.stringify(data));
                    console.log("Received in foreground");
                }
            });

            //fcm.onTokenRefresh( onTokenRefreshCallback(token) );
            //Note that this callback will be fired everytime a new token is generated, including the first time.
            fcm.onTokenRefresh().subscribe(token => {
                alert(token);
                //backend.registerToken(token);
            });

            //fcm.unsubscribeFromTopic('topicExample');
        }
    }
}