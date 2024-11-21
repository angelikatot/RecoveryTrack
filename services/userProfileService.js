import { ref, set, get } from 'firebase/database';
import { database, auth } from './firebaseConfig';

export const saveUserProfile = async (profileData) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('No authenticated user');
            throw new Error('User must be authenticated');
        }

        console.log('Saving profile for user:', user.uid);

        const userProfileRef = ref(database, `userProfiles/${user.uid}`);
        await set(userProfileRef, profileData);

        console.log('Profile saved successfully');
        return profileData;
    } catch (error) {
        console.error('Detailed save error:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        throw error;
    }
};

export const getUserProfile = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('No authenticated user');
            return null;
        }

        console.log('Fetching profile for user:', user.uid);

        const userProfileRef = ref(database, `userProfiles/${user.uid}`);
        const snapshot = await get(userProfileRef);

        if (snapshot.exists()) {
            console.log('Profile found:', snapshot.val());
            return snapshot.val();
        } else {
            console.log('No profile data found');
            return null;
        }
    } catch (error) {
        console.error('Detailed fetch error:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        throw error;
    }
};