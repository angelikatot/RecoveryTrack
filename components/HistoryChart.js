// HistoryChart kaavio näyttää vitaalit (mm. lämpötila) kaavioina. toimii historyscreenin ja datafetchinging kanssa yhteistyössä
import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const HistoryChart = ({ data }) => {
    // Validate and prepare data for the chart
    const prepareChartData = (rawData) => {
        if (!Array.isArray(rawData) || rawData.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        // Helper function to safely map numeric values
        const safeNumberMap = (items, valueAccessor) => {
            return items.map(item => {
                const value = valueAccessor(item);
                return typeof value === 'number' && !isNaN(value) ? value : 0;
            });
        };

        // Helper function to format dates
        const formatDate = (dateString) => {
            try {
                return new Date(dateString).toLocaleDateString();
            } catch (e) {
                return '';
            }
        };

        // Get valid labels (dates)
        const labels = rawData.map(item => formatDate(item.date));

        // Define datasets with proper validation
        const datasets = [
            {
                data: safeNumberMap(rawData, item => item.vitals?.temperature),
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for temperature
                label: 'Temperature',
            },
            {
                data: safeNumberMap(rawData, item => item.vitals?.systolic),
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`, // Blue for systolic
                label: 'Systolic BP',
            },
            {
                data: safeNumberMap(rawData, item => item.vitals?.diastolic),
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`, // Cyan for diastolic
                label: 'Diastolic BP',
            },
            {
                data: safeNumberMap(rawData, item => item.vitals?.heartRate),
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green for heart rate
                label: 'Heart Rate',
            },
            {
                data: safeNumberMap(rawData, item => item.vitals?.weight),
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Orange for weight
                label: 'Weight',
            }
        ];


        return { labels, datasets };
    };

    // Prepare the chart data with validation
    const chartData = prepareChartData(data);

    // If no valid data, show a message
    if (chartData.labels.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.noDataText}>No data available for chart</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vitals History</Text>
            <LineChart
                data={chartData}
                width={width - 40}
                height={220}
                chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                    },
                    // Add these props to prevent NaN errors
                    useShadowColorFromDataset: false,
                    strokeWidth: 2,
                    propsForBackgroundLines: {
                        strokeDasharray: '', // solid background lines
                    },
                }}
                bezier // Make the lines curved
                style={styles.chart}
                // Add these props to improve chart behavior
                withDots={true}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={true}
                withHorizontalLines={true}
                fromZero={true} // Start Y axis from 0
                // Handle empty data gracefully
                getDotColor={(dataPoint, dataSetIndex) => {
                    return chartData.datasets[dataSetIndex]?.color(1) || '#000000';
                }}
            />
            <View style={styles.legend}>
                {chartData.datasets.map((dataset, index) => (
                    <View key={index} style={styles.legendItem}>
                        <View
                            style={[
                                styles.legendColor,
                                { backgroundColor: dataset.color(1) }
                            ]}
                        />
                        <Text style={styles.legendText}>{dataset.label}</Text>
                    </View>
                ))}
            </View>

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
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 5,
    },
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
    },
});

export default HistoryChart;

//https://github.com/indiespirit/react-native-chart-kit