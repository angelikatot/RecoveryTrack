
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    StyleSheet,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { saveUserProfile, getUserProfile } from '../services/userProfileService';

const ProfileDetailsScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [medications, setMedications] = useState('');
    const [contactDetails, setContactDetails] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const profileData = await getUserProfile();
                if (profileData) {
                    setName(profileData.name || '');
                    setAge(profileData.age || '');
                    setMedications(profileData.medications || '');
                    setContactDetails(profileData.contactDetails || '');
                    setEmergencyContact(profileData.emergencyContact || '');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfileData();
    }, []);

    const handleSaveProfile = async () => {
        // Basic validation
        if (!name.trim()) {
            Alert.alert('Validation Error', 'Please enter your name');
            return;
        }

        try {
            const profileData = {
                name: name.trim(),
                age: age.trim(),
                medications: medications.trim(),
                contactDetails: contactDetails.trim(),
                emergencyContact: emergencyContact.trim()
            };

            await saveUserProfile(profileData);
            Alert.alert(
                'Success',
                'Profile updated successfully',
                [{
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to save profile');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>My Personal Details</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name*</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                        required
                    />

                    <Text style={styles.label}>Age</Text>
                    <TextInput
                        style={styles.input}
                        value={age}
                        onChangeText={setAge}
                        placeholder="Enter your age"
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Current Medications</Text>
                    <TextInput
                        style={styles.input}
                        value={medications}
                        onChangeText={setMedications}
                        placeholder="List your current medications"
                        multiline
                    />

                    <Text style={styles.label}>Personal Contact Details</Text>
                    <TextInput
                        style={styles.input}
                        value={contactDetails}
                        onChangeText={setContactDetails}
                        placeholder="Phone number, email, etc."
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Emergency Contact</Text>
                    <TextInput
                        style={styles.input}
                        value={emergencyContact}
                        onChangeText={setEmergencyContact}
                        placeholder="Emergency contact name and number"
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveProfile}
                    >
                        <Text style={styles.saveButtonText}>Save Profile</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
    },
    inputGroup: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
        color: '#333'
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5
    },
    saveButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default ProfileDetailsScreen;