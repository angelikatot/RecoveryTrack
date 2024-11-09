import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import logo from '../assets/logo.png'

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to RecoveryTrack</Text>
            <Image
                source={logo}  // logo kuva
                style={styles.image}
            />
            <Text style={styles.description}>
                Track your symptoms and monitor your health progress. Stay informed and manage your recovery.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 300,
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
    },
});
