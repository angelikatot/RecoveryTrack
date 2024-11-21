import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { useHistoryData } from '../components/DataFetching';

export default function CalendarScreen() {
    const navigation = useNavigation();
    const { history, loading, error, getVitalsByDate } = useHistoryData();

    // Use effect to update marked dates based on history data
    useEffect(() => {
        if (history.length > 0) {
            const marked = history.reduce((acc, record) => {
                const date = record.date.split('T')[0]; // Extract date in 'YYYY-MM-DD' format
                acc[date] = {
                    marked: true,
                    dotColor: 'blue',
                    selected: false
                }; // Mark dates with a dot
                return acc;
            }, {});
            setMarkedDates(marked); // Update the markedDates state
        }
    }, [history]);

    const [markedDates, setMarkedDates] = useState({});

    // Function to handle date selection and navigate to DailyVitalsScreen
    const handleDateSelect = (date) => {
        const selectedRecords = getVitalsByDate(date.dateString);
        if (selectedRecords) {
            navigation.navigate('DailyVitalsScreen', { selectedRecord: selectedRecords });
        } else {
            console.log('No data found for the selected date.');
        }
    };

    // Show loading or error if needed
    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={handleDateSelect} // Handle day press
                markedDates={markedDates} // Display marked dates
                markingType={'simple'} // Simple dot marking
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});