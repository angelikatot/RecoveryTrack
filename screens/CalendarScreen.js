import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
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
                    dotColor: '#6FA6D6',
                    selected: false
                };
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
                <Text style={styles.loadingText}>Loading your calendar...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Unable to load calendar</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>My Health Calendar</Text>
            <View style={styles.calendarContainer}>
                <Calendar
                    onDayPress={handleDateSelect}
                    markedDates={markedDates}
                    markingType={'simple'}
                    style={styles.calendar}
                    theme={{
                        backgroundColor: '#FFFFFF',
                        calendarBackground: '#FFFFFF',
                        textSectionTitleColor: '#4A90E2',
                        selectedDayBackgroundColor: '#A5D8FF',
                        selectedDayTextColor: '#FFFFFF',
                        todayTextColor: '#4A90E2',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#6FA6D6',
                    }}
                    renderHeader={(date) => (
                        <View style={styles.calendarHeader}>
                            <Text style={styles.calendarHeaderText}>
                                {date.toString('MMMM yyyy')}
                            </Text>
                        </View>
                    )}
                />
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Recorded Days</Text>
                    <Text style={styles.infoValue}>{history.length}</Text>
                </View>
            </View>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
        paddingTop: 40,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2d4150',
        textAlign: 'center',
        marginBottom: 20,
    },
    calendarContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        margin: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    calendar: {
        borderRadius: 20,
        padding: 10,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    calendarHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4A90E2',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    infoBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        width: width * 0.4,
    },
    infoTitle: {
        fontSize: 16,
        color: '#4A90E2',
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2d4150',
    },
    loadingText: {
        textAlign: 'center',
        color: '#4A90E2',
        marginTop: 20,
        fontSize: 18,
    },
    errorText: {
        textAlign: 'center',
        color: '#FF6B6B',
        marginTop: 20,
        fontSize: 18,
    },
});