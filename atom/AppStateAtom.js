/* A recoil state to keep track of the
current user's authenticated state on the site.
This atom state can be used anywhere except 
the _app.js file where the recoil root is defined */

import { atom } from "recoil";

export const AppState = atom({
    key: 'AppState', // unique ID (with respect to other atoms/selectors)
    default: "loading", // default value (aka initial value)
});

export const HasAccount  = atom({
    key: 'HasAccount', // unique ID (with respect to other atoms/selectors)
    default: true, // default value (aka initial value)
});



