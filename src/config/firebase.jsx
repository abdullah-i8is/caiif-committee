import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyDg5u-_HPLLH1tCKaqbAnW7tD2wyuuQaIU",
//     authDomain: "travel-mate-1f769.firebaseapp.com",
//     projectId: "travel-mate-1f769",
//     storageBucket: "travel-mate-1f769.appspot.com",
//     messagingSenderId: "156520305847",
//     appId: "1:156520305847:web:431f5a7dfa7e28f2c5a932"
// };

const firebaseConfig = {
    apiKey: "AIzaSyBv2kPPMqoT8Ml3bjsIBkoSovFyXys4nhw",
    authDomain: "travelmate-ef72b.firebaseapp.com",
    projectId: "travelmate-ef72b",
    storageBucket: "travelmate-ef72b.appspot.com",
    messagingSenderId: "32398151777",
    appId: "1:32398151777:web:9645a16ef320f99bd9da20"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);