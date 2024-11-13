
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DailyVitalsScreen = ({ route }) => {
    const { selectedRecord } = route.params;

    if (!selectedRecord) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No data available for the selected date.</Text>
            </View>
        );
    }

    const { date, vitals, symptoms } = selectedRecord;
    const formattedDate = new Date(date).toLocaleDateString();

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Vitals for {formattedDate}</Text>
            <View style={styles.dataSection}>
                <Text style={styles.sectionTitle}>Symptoms:</Text>
                <Text>Pain: {symptoms.pain ?? 'No data'}</Text>
                <Text>Fatigue: {symptoms.fatigue ?? 'No data'}</Text>
                <Text>Mood: {symptoms.mood ?? 'No data'}</Text>
            </View>
            <View style={styles.dataSection}>
                <Text style={styles.sectionTitle}>Vitals:</Text>
                <Text>Temperature: {vitals.temperature ? `${vitals.temperature}°C` : 'No data'}</Text>
                <Text>Blood Pressure: {vitals.bloodPressure || 'No data'}</Text>
                <Text>Heart Rate: {vitals.heartRate ? `${vitals.heartRate} bpm` : 'No data'}</Text>
                <Text>Weight: {vitals.weight ? `${vitals.weight} kg` : 'No data'}</Text>
                <Text>Oxygen Saturation: {vitals.oxygenSaturation ? `${vitals.oxygenSaturation}%` : 'No data'}</Text>
                <Text>Wound Healing: {vitals.woundHealing || 'No data'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dataSection: {
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 5,
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        padding: 20,
    },
});

export default DailyVitalsScreen;