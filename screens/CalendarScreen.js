
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { useHistoryData } from '../components/DataFetching';

export default function CalendarScreen() {
    const navigation = useNavigation();
    const { history, loading, error, getVitalsByDate } = useHistoryData(); // Destructure getVitalsByDate from the hook

    // Use effect to update marked dates based on history data
    useEffect(() => {
        if (history) {
            const marked = history.reduce((acc, record) => {
                const date = record.date.split('T')[0]; // Extract date in 'YYYY-MM-DD' format
                acc[date] = { marked: true, dotColor: 'blue' }; // Mark dates with a dot
                return acc;
            }, {});
            setMarkedDates(marked); // Update the markedDates state
        }
    }, [history]);

    const [markedDates, setMarkedDates] = useState({});

    // Function to handle date selection and navigate to DailyVitalsScreen
    const handleDateSelect = (date) => {
        const selectedRecord = getVitalsByDate(date);
        if (selectedRecord) {
            navigation.navigate('DailyVitalsScreen', { selectedRecord });
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
            {/* Display the calendar, and navigate to DailyVitalsScreen on date selection */}
            <Calendar
                onDayPress={(day) => handleDateSelect(day.dateString)} // Handle day press
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