import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { signUp, signIn } from '../services/authService';


const AuthScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSignUp = async () => {
        try {
            await signUp(email, password);
            Alert.alert('Success', 'Account created successfully');
        } catch (error) {
            console.error('Sign Up Error:', error);
            Alert.alert('Sign Up Error', error.message);
            setError(error.message);
        }
    };

    const handleSignIn = async () => {
        try {
            await signIn(email, password);

        } catch (error) {
            console.error('Sign In Error:', error);
            Alert.alert('Sign In Error', error.message);
            setError(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.authContainer}>
                <Text style={styles.title}>Sign In</Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <Button title="Sign Up" onPress={handleSignUp} />
                <View style={styles.spacer} />
                <Button title="Sign In" onPress={handleSignIn} color="green" />
                {error && <Text style={styles.error}>{error}</Text>}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    authContainer: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    spacer: {
        marginVertical: 10,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
});

export default AuthScreen;
