
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { getUserProfile } from '../services/userProfileService';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getUserProfile();
                if (profile) {
                    setUserProfile(profile);
                } else {
                    console.log('No profile found');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        // Fetch profile when screen comes into focus
        const unsubscribe = navigation.addListener('focus', fetchUserProfile);

        // Initial fetch
        fetchUserProfile();

        // Cleanup listener
        return unsubscribe;
    }, [navigation]);

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }]
                });
            })
            .catch(error => console.error('Error signing out:', error));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>My Profile</Text>
            </View>

            {userProfile ? (
                <View style={styles.profileSection}>
                    <ProfileDetailItem
                        icon="person-outline"
                        label="Name"
                        value={userProfile.name}
                    />
                    <ProfileDetailItem
                        icon="calendar-outline"
                        label="Age"
                        value={userProfile.age}
                    />
                    <ProfileDetailItem
                        icon="medical-outline"
                        label="Medications"
                        value={userProfile.medications}
                    />
                    <ProfileDetailItem
                        icon="call-outline"
                        label="Contact Details"
                        value={userProfile.contactDetails}
                    />
                    <ProfileDetailItem
                        icon="warning-outline"
                        label="Emergency Contact"
                        value={userProfile.emergencyContact}
                    />
                </View>
            ) : (
                <View style={styles.noProfileContainer}>
                    <Text style={styles.noProfileText}>No profile details added yet</Text>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('ProfileDetailsScreen')}
                >
                    <Ionicons name="create-outline" size={20} color="white" />
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                >
                    <Ionicons name="log-out-outline" size={20} color="white" />
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const ProfileDetailItem = ({ icon, label, value }) => (
    <View style={styles.detailItem}>
        <Ionicons name={icon} size={24} color="#007bff" style={styles.detailIcon} />
        <View>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value || 'Not provided'}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    headerContainer: {
        backgroundColor: '#007bff',
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    profileSection: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 10
    },
    detailIcon: {
        marginRight: 15
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500'
    },
    noProfileContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    noProfileText: {
        fontSize: 16,
        color: '#666'
    },
    buttonContainer: {
        paddingHorizontal: 15,
        marginBottom: 20
    },
    editButton: {
        backgroundColor: '#007bff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10
    },
    signOutButton: {
        backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 5
    },
    signOutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10
    }
});

export default ProfileScreen;