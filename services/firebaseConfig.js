// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXwQNGS6NGWmOCHJrpeW9bsE-li25z1xk",
    authDomain: "recoverytrack-56751.firebaseapp.com",
    projectId: "recoverytrack-56751",
    storageBucket: "recoverytrack-56751.appspot.com",
    messagingSenderId: "675888832658",
    appId: "1:675888832658:web:7f24e2b82794e3a16d064b",
    measurementId: "G-HNNPX64HW4"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, database }; 