import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firebase from '../services/firebaseConfig';

export default function HistoryScreen() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await firebase.collection('dailyRecords').orderBy('date', 'desc').get();
            setHistory(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        };
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Text>History of Recorded Data</Text>
            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.record}>
                        <Text>Date: {item.date.toDate().toDateString()}</Text>
                        <Text>Pain: {item.symptoms.pain}</Text>
                        <Text>Fatigue: {item.symptoms.fatigue}</Text>
                        <Text>Temperature: {item.vitals.temperature}</Text>
                        <Text>Blood Pressure: {item.vitals.bloodPressure}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    record: { padding: 10, marginVertical: 5, borderBottomWidth: 1 }
});
