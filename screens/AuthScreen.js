import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { signUp, signIn, signOut } from '../services/authService';

const AuthScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const handleSignUp = async () => {
        try {
            const newUser = await signUp(email, password);
            setUser(newUser);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSignIn = async () => {
        try {
            const loggedInUser = await signIn(email, password);
            setUser(loggedInUser);
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        setUser(null);
    };

    return (
        <View style={styles.container}>
            {user ? (
                <View>
                    <Text>Welcome, {user.email}</Text>
                    <Button title="Sign Out" onPress={handleSignOut} />
                </View>
            ) : (
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
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',  // Centers vertically
        alignItems: 'center',       // Centers horizontally
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
