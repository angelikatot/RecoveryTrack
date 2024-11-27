import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { getUserProfile } from '../services/userProfileService';

export default function HomeScreen() {
    const [userProfile, setUserProfile] = useState(null);
    const [daysSinceDischarge, setDaysSinceDischarge] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getUserProfile();
                if (profile) {
                    setUserProfile(profile);
                    calculateDaysSinceDischarge(profile.dateOfDischarge);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const calculateDaysSinceDischarge = (dischargeDate) => {
        const dischargeDateObj = new Date(dischargeDate);
        const today = new Date();
        const diffTime = today - dischargeDateObj;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
        setDaysSinceDischarge(diffDays);
    };

    const getGreeting = () => {
        const currentHour = new Date().getHours();

        if (currentHour < 12) {
            return 'Good Morning';
        } else if (currentHour < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    };

    return (
        <ImageBackground
            source={require('../assets/background3.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>RecoveryTrack</Text>
                {userProfile ? (
                    <View style={styles.greetingBox}>
                        <Text style={styles.greeting}>
                            {getGreeting()}, {userProfile.name}! Day {daysSinceDischarge} of recovery.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.greetingBox}>
                        <Text style={styles.greeting}>Loading profile...</Text>
                    </View>
                )}
                <Text style={styles.description}>
                    Track your symptoms and monitor your health progress. Stay informed and manage your recovery.
                </Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        fontFamily: 'Parkinsans-VariableFont_wght', // Ensure this font is loaded
    },
    greetingBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    greeting: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        color: '#333',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff',
        marginTop: 10,
    },
});
