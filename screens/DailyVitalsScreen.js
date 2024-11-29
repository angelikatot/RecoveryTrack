import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
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
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
            <Text style={styles.headerText}>
                Vitals for {new Date(selectedRecord[0].date).toLocaleDateString()}
            </Text>

            {selectedRecord.map((record, index) => (
                <View key={index} style={styles.recordContainer}>
                    <View style={styles.recordTimeContainer}>
                        <Text style={styles.recordTime}>
                            {new Date(record.date).toLocaleTimeString()}
                        </Text>
                    </View>

                    <View style={styles.dataSection}>
                        <Text style={styles.sectionTitle}>Symptoms</Text>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Pain:</Text>
                            <Text style={styles.dataValue}>{record.symptoms.pain ?? 'No data'}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Fatigue:</Text>
                            <Text style={styles.dataValue}>{record.symptoms.fatigue ?? 'No data'}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Mood:</Text>
                            <Text style={styles.dataValue}>{record.symptoms.mood ?? 'No data'}</Text>
                        </View>
                    </View>

                    <View style={styles.dataSection}>
                        <Text style={styles.sectionTitle}>Vitals</Text>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Temperature:</Text>
                            <Text style={styles.dataValue}>
                                {record.vitals.temperature ? `${record.vitals.temperature}°C` : 'No data'}
                            </Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Blood Pressure:</Text>
                            <Text style={styles.dataValue}>
                                {record.vitals.systolic !== null && record.vitals.diastolic !== null
                                    ? `${record.vitals.systolic}/${record.vitals.diastolic} mmHg`
                                    : 'No data'}
                            </Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Heart Rate:</Text>
                            <Text style={styles.dataValue}>
                                {record.vitals.heartRate ? `${record.vitals.heartRate} bpm` : 'No data'}
                            </Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Weight:</Text>
                            <Text style={styles.dataValue}>
                                {record.vitals.weight ? `${record.vitals.weight} kg` : 'No data'}
                            </Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Oxygen Saturation:</Text>
                            <Text style={styles.dataValue}>
                                {record.vitals.oxygenSaturation ? `${record.vitals.oxygenSaturation}%` : 'No data'}
                            </Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Wound Healing:</Text>
                            <Text style={styles.dataValue}>
                                {record.vitals.woundHealing || 'No data'}
                            </Text>
                        </View>

                        {record.vitals.woundImage && (
                            <View style={styles.woundImageContainer}>
                                <Text style={styles.sectionTitle}>Wound Image</Text>
                                <Image
                                    source={{ uri: record.vitals.woundImage }}
                                    style={styles.woundImage}
                                />
                            </View>
                        )}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    scrollContentContainer: {
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2d4150',
        textAlign: 'center',
        marginBottom: 20,
    },
    recordContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        padding: 15,
    },
    recordTimeContainer: {
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 10,
    },
    recordTime: {
        fontSize: 16,
        color: '#4A90E2',
        fontWeight: '500',
    },
    dataSection: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4A90E2',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 5,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 10,
    },
    dataLabel: {
        fontSize: 16,
        color: '#2d4150',
        flex: 1,
    },
    dataValue: {
        fontSize: 16,
        color: '#4A90E2',
        fontWeight: '500',
        textAlign: 'right',
        flex: 1,
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#4A90E2',
        padding: 20,
        marginTop: 40,
    },
    woundImageContainer: {
        marginTop: 15,
    },
    woundImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 15,
        marginTop: 10,
    },
});

export default DailyVitalsScreen;