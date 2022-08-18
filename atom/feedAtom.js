import { atom } from "recoil";

export const loadState = atom({
    key: 'loadState', // unique ID (with respect to other atoms/selectors)
    default: 1, // default value (aka initial value)
});