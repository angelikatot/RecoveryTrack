import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { getDatabase, ref, set, get, child } from 'firebase/database';
import { auth } from './firebaseConfig';

// Firebase database
const db = getDatabase();

//  sign up a new user
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error signing up:", error.message);
        throw error; // Rethrow to allow caller to handle the error
    }
};

// sign in existing user
export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error signing in:", error.message);
        throw error; // Rethrow to allow caller to handle the error
    }
};

// Sign-out 
export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error("Error signing out:", error.message);
        throw error;
    }
};

// Get current user's UID
export const getCurrentUserUid = () => {
    const user = auth.currentUser;
    return user ? user.uid : null;
};

// Function to save user vitals data
export const saveUserVitals = async (vitalData) => {
    const userId = getCurrentUserUid();
    if (userId) {
        try {
            // Store vitals data in Realtime Database under 'users/{userId}/vitals/{timestamp}'
            const vitalsRef = ref(db, `users/${userId}/vitals/${new Date().toISOString()}`);
            await set(vitalsRef, vitalData);
            console.log("Vitals saved successfully");
        } catch (error) {
            console.error("Error saving vitals:", error.message);
        }
    } else {
        throw new Error("No user is signed in");
    }
};

// Function to fetch user vitals data
export const fetchUserVitals = async () => {
    const userId = getCurrentUserUid();
    if (userId) {
        try {
            // Get vitals data from Realtime Database
            const vitalsRef = ref(db, `users/${userId}/vitals`);
            const vitalsSnapshot = await get(vitalsRef);
            if (vitalsSnapshot.exists()) {
                const vitals = vitalsSnapshot.val();
                return Object.values(vitals); // Convert vitals object to an array
            } else {
                console.log("No vitals data available.");
                return [];
            }
        } catch (error) {
            console.error("Error fetching vitals:", error.message);
        }
    } else {
        throw new Error("No user is signed in");
    }
};
