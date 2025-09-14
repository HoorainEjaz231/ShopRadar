// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDfNP6fRmJUCG2upWkCFdLc0SC0_HIodZo",
    authDomain: "practice-b891a.firebaseapp.com",
    projectId: "practice-b891a",
    storageBucket: "practice-b891a.appspot.com",
    messagingSenderId: "1003954449318",
    appId: "1:1003954449318:web:a828f9be4560432b2c3d67",
    measurementId: "G-Z77VV9FQLH"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
