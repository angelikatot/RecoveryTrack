import React from 'react';
import { View, Text, Button } from 'react-native';
import { signOut } from '../services/authService';  // Import signOut function

export default function HomeScreen({ navigation }) {
    const handleSignOut = async () => {
        try {
            await signOut(); // Call the sign-out function from authService
            navigation.navigate('Auth'); // Navigate to the Auth screen (or 'Login') after sign out
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };

    return (
        <View>
            <Text>Today’s Summary</Text>
            <Button
                title="Add Today's Data"
                onPress={() => navigation.navigate('Input')}
            />
            <Button
                title="View History"
                onPress={() => navigation.navigate('History')}
            />
            <Button
                title="Sign Out"
                onPress={handleSignOut}  // Attach the sign out function to the button
            />
        </View>
    );
}
