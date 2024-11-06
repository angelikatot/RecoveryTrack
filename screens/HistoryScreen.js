import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getDatabase, ref, query, orderByChild, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import app from '../services/firebaseConfig';

export default function HistoryScreen() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    setError('User not authenticated.');
                    setLoading(false);
                    return;
                }

                const database = getDatabase(app);
                // Reference to the specific user's data
                const userRecordsRef = ref(database, `dailyRecords/${user.uid}`);

                // Get the data once instead of using onValue
                const snapshot = await get(userRecordsRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const historyArray = Object.entries(data).map(([key, value]) => ({
                        id: key,
                        ...value,
                    }))
                        // Sort by date, most recent first
                        .sort((a, b) => new Date(b.date) - new Date(a.date));

                    setHistory(historyArray);
                } else {
                    setHistory([]);
                    setError('No vitals data available.');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderItem = ({ item }) => {
        const symptoms = item.symptoms || {};
        const vitals = item.vitals || {};

        // Parse the ISO date string
        const date = new Date(item.date);
        const formattedDate = date instanceof Date && !isNaN(date)
            ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
            : 'Invalid date';

        return (
            <View style={styles.record}>
                <Text style={styles.dateText}>Date: {formattedDate}</Text>
                <View style={styles.dataSection}>
                    <Text style={styles.sectionTitle}>Symptoms:</Text>
                    <Text>Pain: {symptoms.pain || 'No data'}</Text>
                    <Text>Fatigue: {symptoms.fatigue || 'No data'}</Text>
                </View>
                <View style={styles.dataSection}>
                    <Text style={styles.sectionTitle}>Vitals:</Text>
                    <Text>Temperature: {vitals.temperature ? `${vitals.temperature}°C` : 'No data'}</Text>
                    <Text>Blood Pressure: {vitals.bloodPressure || 'No data'}</Text>
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
            <Text style={styles.headerText}>History of Recorded Data</Text>
            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No records found</Text>
                }
            />
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