import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

export const signUp = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error signing up:", error.message);
    }
};

export const signIn = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error signing in:", error.message);
    }
};


// Sign-out function
export const signOut = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Error signing out:", error.message);
        throw error;
    }
};
