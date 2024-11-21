import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import app from '../services/firebaseConfig';
import Slider from '@react-native-community/slider';

export default function InputScreen({ navigation }) {
    const [pain, setPain] = useState(0);
    const [fatigue, setFatigue] = useState(0);
    const [mood, setMood] = useState(0);
    const [temperature, setTemperature] = useState('');
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [oxygenSaturation, setOxygenSaturation] = useState('');
    const [weight, setWeight] = useState('');
    const [woundHealing, setWoundHealing] = useState('');
    const [woundImage, setWoundImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setWoundImage(result.uri);
        }
    };

    const validateInputs = () => {
        let errors = [];

        // Temperature validation
        const temp = parseFloat(temperature.replace(',', '.'));
        if (temperature && (isNaN(temp) || temp < 35 || temp > 42)) {
            errors.push('Temperature should be between 35°C and 42°C');
        }

        // Heart rate validation
        const hr = parseInt(heartRate);
        if (heartRate && (isNaN(hr) || hr < 40 || hr > 200)) {
            errors.push('Heart rate should be between 40 and 200 bpm');
        }

        // Weight validation
        const w = parseFloat(weight);
        if (weight && (isNaN(w) || w < 20 || w > 300)) {
            errors.push('Weight should be between 20 and 300 kg');
        }

        // Oxygen saturation validation
        const os = parseInt(oxygenSaturation);
        if (oxygenSaturation && (isNaN(os) || os < 50 || os > 100)) {
            errors.push('Oxygen saturation should be between 50% and 100%');
        }

        // Blood pressure validation
        const sys = parseInt(systolic);
        const dia = parseInt(diastolic);
        if (systolic && (isNaN(sys) || sys < 70 || sys > 250)) {
            errors.push('Systolic pressure should be between 70 and 250 mmHg');
        }
        if (diastolic && (isNaN(dia) || dia < 40 || dia > 150)) {
            errors.push('Diastolic pressure should be between 40 and 150 mmHg');
        }

        return errors;
    };

    const handleSaveVitals = async () => {
        const validationErrors = validateInputs();
        if (validationErrors.length > 0) {
            Alert.alert('Validation Error', validationErrors.join('\n'));
            return;
        }

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const userId = user.uid;
            const database = getDatabase(app);
            const storage = getStorage(app);
            const timestamp = Date.now();
            const recordRef = ref(database, `dailyRecords/${userId}/${timestamp}`);
            let woundImageUrl = null;

            try {
                if (woundImage) {
                    const imageRef = storageRef(storage, `woundImages/${userId}/${timestamp}`);
                    const response = await fetch(woundImage);
                    const blob = await response.blob();
                    await uploadBytes(imageRef, blob);
                    woundImageUrl = await getDownloadURL(imageRef);
                }

                const data = {
                    date: new Date().toISOString(),
                    symptoms: {
                        pain: pain || 0,
                        fatigue: fatigue || 0,
                        mood: mood || 0,
                    },
                    vitals: {
                        temperature: temperature ? parseFloat(temperature.replace(',', '.')) : null,
                        systolic: systolic ? parseInt(systolic) : null,
                        diastolic: diastolic ? parseInt(diastolic) : null,
                        heartRate: heartRate ? parseInt(heartRate) : null,
                        oxygenSaturation: oxygenSaturation ? parseInt(oxygenSaturation) : null,
                        weight: weight ? parseFloat(weight) : null,
                        woundHealing: woundHealing || null,
                        woundImage: woundImageUrl,
                    },
                };
                console.log(data);
                await set(recordRef, data);
                Alert.alert('Success', 'Data saved successfully!');
                navigation.navigate('HistoryScreen');
            } catch (error) {
                console.error('Error saving data: ', error);
                Alert.alert('Error', 'Error saving data. Please try again.');
            }
        } else {
            Alert.alert('Error', 'User not authenticated');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Enter Your Daily Vitals</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Temperature (°C):</Text>
                <TextInput
                    style={styles.input}
                    value={temperature}
                    onChangeText={setTemperature}
                    keyboardType="decimal-pad"
                    placeholder="36.5"
                />

                <Text style={styles.label}>Systolic Pressure (mmHg):</Text>
                <TextInput
                    style={styles.input}
                    value={systolic}
                    onChangeText={setSystolic}
                    keyboardType="numeric"
                    placeholder="120"
                />

                <Text style={styles.label}>Diastolic Pressure (mmHg):</Text>
                <TextInput
                    style={styles.input}
                    value={diastolic}
                    onChangeText={setDiastolic}
                    keyboardType="numeric"
                    placeholder="80"
                />

                <Text style={styles.label}>Pulse (bpm):</Text>
                <TextInput
                    style={styles.input}
                    value={heartRate}
                    onChangeText={setHeartRate}
                    keyboardType="numeric"
                    placeholder="70"
                />

                <Text style={styles.label}>Oxygen Saturation (%):</Text>
                <TextInput
                    style={styles.input}
                    value={oxygenSaturation}
                    onChangeText={setOxygenSaturation}
                    keyboardType="numeric"
                    placeholder="98"
                />

                <Text style={styles.label}>Weight (kg):</Text>
                <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                    placeholder="70.5"
                />
                <Text style={styles.label}>Wound Healing:</Text>
                <TextInput
                    style={styles.input}
                    value={woundHealing}
                    onChangeText={setWoundHealing}
                    placeholder="Describe the wound healing progress"
                />

                <View style={styles.imagePicker}>
                    <Button title="Pick a Wound Image" onPress={pickImage} />
                    {woundImage && (
                        <Image
                            source={{ uri: woundImage }}
                            style={styles.imagePreview}
                        />
                    )}
                </View>

            </View>

            <View style={styles.sliderGroup}>
                <Text style={styles.label}>Pain Level: {pain}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={pain}
                    onValueChange={setPain}
                    minimumTrackTintColor="#FF5733"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#FF5733"
                />

                <Text style={styles.label}>Mood Level: {mood}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={mood}
                    onValueChange={setMood}
                    minimumTrackTintColor="#FF5733"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#FF5733"
                />

                <Text style={styles.label}>Fatigue Level: {fatigue}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={fatigue}
                    onValueChange={setFatigue}
                    minimumTrackTintColor="#FF5733"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#FF5733"
                />
            </View>

            <Button title="Save Vitals" onPress={handleSaveVitals} />
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    sliderGroup: {
        marginBottom: 20,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 15,
    },
    imagePicker: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    imagePreview: {
        width: 200,
        height: 150,
        resizeMode: 'contain',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


// https://www.npmjs.com/package/@react-native-community/slider  Slider