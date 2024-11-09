import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import app from '../services/firebaseConfig';

export default function InputScreen({ navigation }) {
    const [pain, setPain] = useState('');
    const [fatigue, setFatigue] = useState('');
    const [temperature, setTemperature] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');

    // Function to handle saving vitals data
    const handleSaveVitals = () => {
        console.log(navigation);
        const auth = getAuth();
        const user = auth.currentUser;

        // Convert , to . for temperature 
        let formattedTemperature = temperature.replace(',', '.');

        // Validate if temperature is a valid number
        if (isNaN(formattedTemperature) || formattedTemperature === '') {
            Alert.alert('Invalid Temperature', 'Please enter a valid temperature');
            return;
        }

        if (user) {
            const userId = user.uid; //  user's unique ID
            const database = getDatabase(app);

            // Use a timestamp for the path 
            const timestamp = Date.now();  // This will provide a unique key based on the current time

            // Create a new record for daily vitals and symptoms using timestamp as the path
            const recordRef = ref(database, `dailyRecords/${userId}/${timestamp}`);

            // Set the data in Firebase
            set(recordRef, {
                date: new Date().toISOString(),  // Store ISO string as a field
                symptoms: {
                    pain: pain,
                    fatigue: fatigue,
                },
                vitals: {
                    temperature: formattedTemperature,  // Store formatted temperature
                    bloodPressure: bloodPressure,  // Storing  string ( "120/80")
                }
            })
                .then(() => {

                    alert('Data saved successfully!');
                    navigation.navigate('HistoryScreen');
                })
                .catch((error) => {
                    console.error('Error saving data: ', error);
                    alert('Error saving data. Please try again.');
                });
        } else {
            alert('User not authenticated');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Enter Your Daily Vitals</Text>

            <Text>Pain Level:</Text>
            <TextInput
                style={styles.input}
                value={pain}
                onChangeText={setPain}
                keyboardType="numeric"
            />

            <Text>Fatigue Level:</Text>
            <TextInput
                style={styles.input}
                value={fatigue}
                onChangeText={setFatigue}
                keyboardType="numeric"
            />

            <Text>Temperature (°C):</Text>
            <TextInput
                style={styles.input}
                value={temperature}
                onChangeText={setTemperature}
                keyboardType="decimal-pad"
            />

            <Text>Blood Pressure (mmHg):</Text>
            <TextInput
                style={styles.input}
                value={bloodPressure}
                onChangeText={setBloodPressure}
                placeholder="Enter as 120/80"
            />

            <Button title="Save Vitals" onPress={handleSaveVitals} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { borderWidth: 1, padding: 10, marginVertical: 10 },
});
