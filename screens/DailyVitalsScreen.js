import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'react-native';

const DailyVitalsScreen = ({ route }) => {
    const { selectedRecord } = route.params;

    if (!selectedRecord || selectedRecord.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No data available for the selected date.</Text>
            </View>
        );
    }

    // Render multiple records if available
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerText}>Vitals for {new Date(selectedRecord[0].date).toLocaleDateString()}</Text>

            {selectedRecord.map((record, index) => (
                <View key={index} style={styles.recordContainer}>
                    <Text style={styles.recordTime}>
                        {new Date(record.date).toLocaleTimeString()}
                    </Text>

                    <View style={styles.dataSection}>
                        <Text style={styles.sectionTitle}>Symptoms:</Text>
                        <Text>Pain: {record.symptoms.pain ?? 'No data'}</Text>
                        <Text>Fatigue: {record.symptoms.fatigue ?? 'No data'}</Text>
                        <Text>Mood: {record.symptoms.mood ?? 'No data'}</Text>
                    </View>

                    <View style={styles.dataSection}>
                        <Text style={styles.sectionTitle}>Vitals:</Text>
                        <Text>Temperature: {record.vitals.temperature ? `${record.vitals.temperature}°C` : 'No data'}</Text>
                        <Text>
                            Blood Pressure: {record.vitals.systolic !== null && record.vitals.diastolic !== null
                                ? `${record.vitals.systolic}/${record.vitals.diastolic} mmHg`
                                : 'No data'}
                        </Text>
                        <Text>Heart Rate: {record.vitals.heartRate ? `${record.vitals.heartRate} bpm` : 'No data'}</Text>
                        <Text>Weight: {record.vitals.weight ? `${record.vitals.weight} kg` : 'No data'}</Text>
                        <Text>Oxygen Saturation: {record.vitals.oxygenSaturation ? `${record.vitals.oxygenSaturation}%` : 'No data'}</Text>
                        <Text>Wound Healing: {record.vitals.woundHealing || 'No data'}</Text>

                        {record.vitals.woundImage && (
                            <Image
                                source={{ uri: record.vitals.woundImage }}
                                style={styles.woundImage}
                            />
                        )}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    recordContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    recordTime: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
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
    woundImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginTop: 10,
        borderRadius: 8,
    },
});

export default DailyVitalsScreen;