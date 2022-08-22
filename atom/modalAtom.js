import { atom } from "recoil";

/* ========= Comment Modal ========== */

export const modalState = atom({
    key: 'modalState', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
});

export const postIdState = atom({
    key: 'postIdState', // unique ID (with respect to other atoms/selectors)
    default: "", // default value (aka initial value)
});

export const quoteState = atom({
    key:'quoteState', // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
})

/* =========== Buy Creator Coin Modal ======== */

export const CreatorState = atom({
    key: "creatorState", // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
})

/* =========== Buy NFT Modal ============= */

export const NFTState = atom({
    key: "NFTState", // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
})

/* ============ Create NFT Modal ========= */

export const CreateNftState = atom({
    key: "CreateNftState", // unique ID (with respect to other atoms/selectors)
    default: false, // default value (aka initial value)
})
export const createNftHash = atom({
    key: "createNftHash",  // unique ID (with respect to other atoms/selectors)
    default: null // default value (aka initial value)
})

/* ============== Update Post Modal ============== */

export const EditState = atom({
    key: "EditState", // unique ID (with respect to other atoms/selectors)
    default: false // default value (aka initial value)
})
export const EditStateHash = atom({
    key: "EditStateHash", // unique ID (with respect to other atoms/selectors)
    default: null // default value (aka initial value)
})


/* =========== Success/Error Modal ============= */

export const Response = atom({
    key: "Response", // unique ID (with respect to other atoms/selectors)
    default: null // default value (aka initial value)
})