/* A recoil state to keep track of the
current user's notification count on the site.
This atom state can be used anywhere except 
the _app.js file where the recoil root is defined */

//Import atom from react.
import { atom } from "recoil";

//The user's notification count.
export const NotificationAmount = atom({
    key: 'NotificationAmount', // unique ID (with respect to other atoms/selectors)
    default: "", // default value (aka initial value)
});

//The image that should be displayed in the sidebar and mobile bottom bar.
//With red spot if the user has more then 0 new notifications.
//A normal bell if the user has 0 new notifications.

export const NotifiImage = atom({
    key:"NotifiImage", // unique ID (with respect to other atoms/selectors)
    default: false // default value (aka initial value)
})