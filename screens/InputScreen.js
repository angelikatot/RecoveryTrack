import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import app from '../services/firebaseConfig';
import NetInfo from "@react-native-community/netinfo";

function InputScreen() {
    const [pain, setPain] = useState('');
    const [fatigue, setFatigue] = useState('');
    const [temperature, setTemperature] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [items, setItems] = useState([]);
    const [isConnected, setIsConnected] = useState(true);
    const database = getDatabase(app);

    useEffect(() => {
        // network connection
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        //  Firebase database listener
        const itemsRef = ref(database, 'dailyRecords/');
        const unsubscribeData = onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setItems(Object.entries(data).map(([key, value]) => ({ key, ...value })));
            } else {
                setItems([]);
            }
        });

        return () => {
            unsubscribe();
            unsubscribeData();
        };
    }, [database]);

    const handleSave = () => {
        // virhekäsittely (netti)
        if (!isConnected) {
            Alert.alert('No Internet', 'Please check your internet connection');
            return;
        }

        // Validate input
        if (!pain || !fatigue || !temperature || !bloodPressure) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // convert string-> number
        const numericPain = parseFloat(pain);
        const numericFatigue = parseFloat(fatigue);
        const numericTemperature = parseFloat(temperature);

        if (isNaN(numericPain) || isNaN(numericFatigue) || isNaN(numericTemperature)) {
            Alert.alert('Error', 'Please enter valid numeric values for Pain, Fatigue, and Temperature');
            return;
        }

        // put new values to Firebase
        push(ref(database, 'dailyRecords/'), {
            date: new Date().toISOString(),
            symptoms: {
                pain: numericPain,
                fatigue: numericFatigue
            },
            vitals: {
                temperature: numericTemperature,
                bloodPressure
            }
        })
            .then(() => {
                Alert.alert('Success', 'Data saved successfully!');
                // Reset form
                setPain('');
                setFatigue('');
                setTemperature('');
                setBloodPressure('');
            })
            .catch((error) => {
                Alert.alert('Error', 'Failed to save data: ' + error.message);
            });
    };

    const handleRemove = (key) => {
        remove(ref(database, `dailyRecords/${key}`))
            .then(() => {
                Alert.alert('Success', 'Item removed successfully.');
            })
            .catch((error) => {
                Alert.alert('Error', 'Could not remove item: ' + error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Record Symptoms and Vitals</Text>
            <TextInput
                placeholder="Pain Level (0-10)"
                value={pain}
                onChangeText={setPain}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Fatigue Level (0-10)"
                value={fatigue}
                onChangeText={setFatigue}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Temperature (°F)"
                value={temperature}
                onChangeText={setTemperature}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Blood Pressure (e.g. 120/80)"
                value={bloodPressure}
                onChangeText={setBloodPressure}
                style={styles.input}
            />
            {!isConnected && (
                <Text style={styles.connectionWarning}>
                    No internet connection. Data cannot be saved.
                </Text>
            )}
            <Button
                title="SAVE"
                onPress={handleSave}
                disabled={!isConnected}
            />
            <FlatList
                data={items}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text>{`Pain: ${item.symptoms.pain}, Fatigue: ${item.symptoms.fatigue}, Temperature: ${item.vitals.temperature}, Blood Pressure: ${item.vitals.bloodPressure}`}</Text>
                        <Button title="Delete" onPress={() => handleRemove(item.key)} />
                    </View>
                )}
                style={styles.listContainer}
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 10,
        padding: 8
    },
    connectionWarning: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: '100%',
    },
    listContainer: {
        marginTop: 20,
        width: '100%',
    },
});

export default InputScreen;
