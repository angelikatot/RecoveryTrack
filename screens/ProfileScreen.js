// ProfileScreen.js
import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { auth } from '../services/firebaseConfig';

const ProfileScreen = ({ navigation }) => {
    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace('Auth'); // Redirect to Auth screen after signing out
            })
            .catch(error => console.error('Error signing out:', error));
    };

    // You can also set the screen's options here if you want to customize further
    useEffect(() => {
        navigation.setOptions({
            title: 'Profile',
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Button title="Sign Out" onPress={handleSignOut} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;
