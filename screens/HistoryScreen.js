// HistoryScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useHistoryData } from '../components/DataFetching';
import HistoryChart from '../components/HistoryChart';

export default function HistoryScreen() {
    const { history, loading, error } = useHistoryData();
    const [expanded, setExpanded] = useState(null);
    const [selectedVital, setSelectedVital] = useState(null);

    const vitalCharts = [
        'temperature', 'bloodPressure', // replaces 'systolic' and 'diastolic'
        'heartRate', 'weight', 'oxygenSaturation'
    ];
    const renderAccordionSection = (vital) => {
        // Special handling for blood pressure
        const hasBPData = vital === 'bloodPressure'
            ? history.some(day =>
                day.vitals.systolic !== null || day.vitals.diastolic !== null)
            : history.some(day => day.vitals[vital] !== null);

        const getBPValue = (record) => {
            const systolic = record.vitals.systolic;
            const diastolic = record.vitals.diastolic;
            if (systolic !== null && diastolic !== null) {
                return `${systolic}/${diastolic}`;
            }
            return 'No data';
        };

        return (
            <View key={vital}>
                <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => handleAccordionPress(vital)}
                >
                    <Text style={styles.accordionHeaderText}>
                        {vital === 'bloodPressure'
                            ? 'Blood Pressure'
                            : vital.charAt(0).toUpperCase() + vital.slice(1)}
                    </Text>
                </TouchableOpacity>
                {expanded === vital && (
                    <View style={styles.accordionContent}>
                        <HistoryChart
                            data={history}
                            selectedVital={vital}
                        />
                        {history.length > 0 ? (
                            history.map((day) => (
                                <View key={day.date}>
                                    <Text style={styles.dateHeader}>
                                        {new Date(day.date).toLocaleDateString()}
                                    </Text>
                                    {vital === 'bloodPressure' ? (
                                        <Text style={styles.medianValue}>
                                            Daily Median: {day.vitals.systolic?.toFixed(0) || '-'}/
                                            {day.vitals.diastolic?.toFixed(0) || '-'} mmHg
                                        </Text>
                                    ) : (
                                        <Text style={styles.medianValue}>
                                            Daily Median: {day.vitals[vital]?.toFixed(1) || 'No data'}
                                        </Text>
                                    )}
                                    {day.records.map((record, index) => (
                                        <View key={index} style={styles.record}>
                                            <Text style={styles.recordTime}>
                                                {record.formattedTime}
                                            </Text>
                                            <Text style={styles.recordValue}>
                                                {vital === 'bloodPressure'
                                                    ? `BP: ${getBPValue(record)}`
                                                    : `Value: ${record.vitals[vital]}`}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>
                                No records found for {vital === 'bloodPressure' ? 'blood pressure' : vital}.
                            </Text>
                        )}
                    </View>
                )}
            </View>
        );
    };

    const handleAccordionPress = (vital) => {
        setExpanded(expanded === vital ? null : vital);
        setSelectedVital(vital);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>History (Last 7 Days)</Text>
            <ScrollView>
                {vitalCharts.map((vital) => renderAccordionSection(vital))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    accordionHeader: {
        backgroundColor: '#e0e0e0',
        padding: 15,
        marginBottom: 5,
        borderRadius: 10,
    },
    accordionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    accordionContent: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    medianValue: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    record: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        marginVertical: 2,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
    },
    recordTime: {
        fontSize: 14,
        color: '#444',
    },
    recordValue: {
        fontSize: 14,
        color: '#444',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 10,
        color: '#666',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});