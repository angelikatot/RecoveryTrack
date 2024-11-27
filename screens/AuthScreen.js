import React, { useState } from 'react';
import {
    View,
    TextInput,
    Pressable,
    Text,
    StyleSheet,
    Alert,
    ImageBackground,
} from 'react-native';
import { useFonts } from 'expo-font';
import { signUp, signIn } from '../services/authService'; //// firebase authentication 


//management for form inputs and errors
const AuthScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const [fontsLoaded] = useFonts({
        'CustomFont': require('../assets/fonts/Parkinsans-VariableFont_wght.ttf'), // google fonts Parkinsans
    });

    // Prevent rendering until font is loaded
    if (!fontsLoaded) {
        return null;
    }

    //kokeillaan tehdä uusi käyttäjä
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

    //kokeillaan kirjata sisään käyttäjä
    const handleSignIn = async () => {
        try {
            await signIn(email, password);
            Alert.alert('Success', 'Signed in successfully');
        } catch (error) {
            console.error('Sign In Error:', error);
            Alert.alert('Sign In Error', error.message);
            setError(error.message);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/background1.jpg')} //taustakuva
            style={styles.background}
            resizeMode="cover"
        >

            {/* Main container  */}
            <View style={styles.container}>

                {/* Authentication form container */}
                <View style={styles.authContainer}>
                    <Text style={[styles.title, { fontFamily: 'CustomFont' }]}>
                        RecoveryTrack
                    </Text>
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
                    <Pressable style={styles.button} onPress={handleSignIn}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </Pressable>
                    {error && <Text style={styles.error}>{error}</Text>}
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    authContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        color: '#444',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        minWidth: 250,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#6db3f2',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    secondaryButton: {
        backgroundColor: '#FFB6C1',
        width: '30%', // pienempi kuin sign in button
        padding: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
});

export default AuthScreen;

// Reference: https://docs.expo.dev/guides/using-custom-fonts/
// Reference: https://react.dev/reference/react/useState
// Reference: https://reactnative.dev/docs/stylesheet

// Async funktio: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
//Taustakuva: https://reactnative.dev/docs/imagebackground
// Button: https://reactnative.dev/docs/pressable

