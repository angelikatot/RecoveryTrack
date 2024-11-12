// HistoryScreen näyttö, joka näyttää käyttäjän tallentamia oireita. 
// käyttää useHistoryData-hookia ja HistoryChart-komponenttia tiedon hakemiseen ja visualisointiin.



import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useHistoryData } from '../components/DataFetching';
import HistoryChart from '../components/HistoryChart';

export default function HistoryScreen() {
    const { history, loading, error } = useHistoryData();

    const renderItem = ({ item }) => {
        const symptoms = item.symptoms || {};
        const vitals = item.vitals || {};

        const date = new Date(item.date);
        const formattedDate = date instanceof Date && !isNaN(date)
            ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
            : 'Invalid date';

        return (
            <View style={styles.record}>
                <Text style={styles.dateText}>Date: {formattedDate}</Text>

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
            {history.length > 0 ? (
                <>
                    <HistoryChart data={history} />
                    <FlatList
                        data={history}
                        keyExtractor={(item, index) => item.id || index.toString()}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No records found</Text>
                            </View>
                        }
                    />
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No records found</Text>
                </View>
            )}
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

    record: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
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
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
});

//https://reactnative.dev/docs/flatlist