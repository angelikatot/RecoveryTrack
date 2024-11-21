import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useHistoryData } from '../components/DataFetching';
import HistoryChart from '../components/HistoryChart';

export default function HistoryScreen() {
    const { history, loading, error } = useHistoryData();
    const [expanded, setExpanded] = useState(null); // Tracks the currently expanded section.
    const [selectedVital, setSelectedVital] = useState(null);

    const vitalCharts = [
        'temperature', 'systolic', 'diastolic',
        'heartRate', 'weight', 'oxygenSaturation'
    ];

    const renderAccordionSection = (vital) => {
        const sectionData = history.filter((record) => record.vitals[vital] !== null);

        return (
            <View key={vital}>
                <TouchableOpacity
                    style={styles.accordionHeader}
                    onPress={() => handleAccordionPress(vital)}
                >
                    <Text style={styles.accordionHeaderText}>
                        {vital.charAt(0).toUpperCase() + vital.slice(1)}
                    </Text>
                </TouchableOpacity>
                {expanded === vital && (
                    <View style={styles.accordionContent}>
                        <HistoryChart
                            data={sectionData}
                            selectedVital={vital}
                        />
                        {sectionData.length > 0 ? (
                            sectionData.map((record) => (
                                <View key={record.date} style={styles.record}>
                                    {/* Wrap the text content within a Text component */}
                                    <Text>{`Date: ${new Date(record.date).toLocaleDateString()}`}</Text>
                                    <Text>{`Value: ${record.vitals[vital]}`}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No records found for {vital}.</Text>
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
            <Text style={styles.headerText}>History</Text>
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
    record: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
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
