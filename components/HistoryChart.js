// HistoryChart kaavio näyttää vitaalit (mm. lämpötila) kaavioina. toimii historyscreenin ja datafetchinging kanssa yhteistyössä
// HistoryChart.js
import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const HistoryChart = ({ data, selectedVital = null }) => {
    const prepareChartData = (rawData, vital) => {
        if (!Array.isArray(rawData) || rawData.length === 0) {
            return { labels: [], datasets: [] };
        }

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        };

        const labels = rawData.map(item => formatDate(item.date));

        const vitalConfigs = {
            temperature: {
                accessor: item => item.vitals?.temperature,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                label: 'Temperature (°C)'
            },
            bloodPressure: {
                systolicAccessor: item => item.vitals?.systolic,
                diastolicAccessor: item => item.vitals?.diastolic,
                systolicColor: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
                diastolicColor: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`,
                label: 'Blood Pressure (mmHg)'
            },
            heartRate: {
                accessor: item => item.vitals?.heartRate,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                label: 'Heart Rate (bpm)'
            },
            weight: {
                accessor: item => item.vitals?.weight,
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                label: 'Weight (kg)'
            },
            oxygenSaturation: {
                accessor: item => item.vitals?.oxygenSaturation,
                color: (opacity = 1) => `rgba(128, 0, 128, ${opacity})`,
                label: 'Oxygen Saturation (%)'
            },

            pain: {
                accessor: item => item.symptoms?.pain,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                label: 'Pain Level'
            },
            mood: {
                accessor: item => item.symptoms?.mood,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                label: 'Mood Level'
            },
            fatigue: {
                accessor: item => item.symptoms?.fatigue,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                label: 'Fatigue Level'
            }

        };

        if (selectedVital === 'bloodPressure') {
            return {
                labels,
                datasets: [
                    {
                        data: rawData.map(item => vitalConfigs.bloodPressure.systolicAccessor(item) || 0),
                        color: vitalConfigs.bloodPressure.systolicColor,
                        strokeWidth: 2,
                        label: 'Systolic'
                    },
                    {
                        data: rawData.map(item => vitalConfigs.bloodPressure.diastolicAccessor(item) || 0),
                        color: vitalConfigs.bloodPressure.diastolicColor,
                        strokeWidth: 2,
                        label: 'Diastolic'
                    }
                ]
            };
        } else if (selectedVital && vitalConfigs[selectedVital]) {
            const config = vitalConfigs[selectedVital];
            return {
                labels,
                datasets: [{
                    data: rawData.map(item => config.accessor(item) || 0),
                    color: config.color,
                    strokeWidth: 2,
                    label: config.label
                }]
            };
        }

        return { labels, datasets: [] };
    };

    const chartData = prepareChartData(data, selectedVital);

    if (chartData.labels.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No data available for chart</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {selectedVital === 'bloodPressure'
                    ? 'Blood Pressure (mmHg)'
                    : selectedVital
                        ? `${chartData.datasets[0].label}`
                        : 'Vitals History'}
            </Text>
            <LineChart
                data={chartData}
                width={width - 40}
                height={220}
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: '4',
                        strokeWidth: '2',
                    }
                }}
                bezier
                style={styles.chart}
                withDots={true}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={true}
                withHorizontalLines={true}
                fromZero={false}
                getDotColor={(dataPoint, dataSetIndex) => {
                    return chartData.datasets[dataSetIndex]?.color(1) || '#000000';
                }}
            />
            {selectedVital === 'bloodPressure' && (
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: chartData.datasets[0].color(1) }]} />
                        <Text style={styles.legendText}>Systolic</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: chartData.datasets[1].color(1) }]} />
                        <Text style={styles.legendText}>Diastolic</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginVertical: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        padding: 20,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        gap: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
    }
});

export default HistoryChart;
//https://github.com/indiespirit/react-native-chart-kit