import { initializeApp } from "firebase/app";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { initializeAuth, getReactNativePersistence, connectAuthEmulator } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

if (!auth) {
    console.error('Firebase Auth failed to initialize');
}

if (!database) {
    console.error('Firebase Database failed to initialize');
}

export { app, database, auth };