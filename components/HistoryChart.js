// HistoryChart kaavio näyttää vitaalit (mm. lämpötila) kaavioina. toimii historyscreenin ja datafetchinging kanssa yhteistyössä
import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const HistoryChart = ({ data, selectedVital = null }) => {
    const prepareChartData = (rawData, vital) => {
        if (!Array.isArray(rawData) || rawData.length === 0) {
            return { labels: [], datasets: [] };
        }

        const safeNumberMap = (items, valueAccessor) => {
            return items.map(item => {
                const value = valueAccessor(item);
                return typeof value === 'number' && !isNaN(value) ? value : 0;
            });
        };

        const formatDate = (dateString) => {
            try {
                return new Date(dateString).toLocaleDateString();
            } catch (e) {
                return '';
            }
        };

        const labels = rawData.map(item => formatDate(item.date));

        // Vital-specific color and accessor mapping
        const vitalConfigs = {
            temperature: {
                accessor: item => item.vitals?.temperature,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                label: 'Temperature (°C)'
            },
            systolic: {
                accessor: item => item.vitals?.systolic,
                color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
                label: 'Systolic BP (mmHg)'
            },
            diastolic: {
                accessor: item => item.vitals?.diastolic,
                color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`,
                label: 'Diastolic BP (mmHg)'
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
            }
        };

        // If no specific vital selected, use default behavior
        if (!selectedVital) {
            const datasets = Object.keys(vitalConfigs).map(key => ({
                data: safeNumberMap(rawData, vitalConfigs[key].accessor),
                strokeWidth: 2,
                color: vitalConfigs[key].color,
                label: vitalConfigs[key].label
            }));
            return { labels, datasets };
        }

        // If a specific vital is selected
        const vitalConfig = vitalConfigs[selectedVital];
        if (!vitalConfig) {
            return { labels: [], datasets: [] };
        }

        const datasets = [{
            data: safeNumberMap(rawData, vitalConfig.accessor),
            strokeWidth: 2,
            color: vitalConfig.color,
            label: vitalConfig.label
        }];

        return { labels, datasets };
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
                {selectedVital
                    ? `${chartData.datasets[0].label} History`
                    : 'Vitals History'}
            </Text>
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
                    style: { borderRadius: 16 },
                    propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#ffa726',
                    },
                    useShadowColorFromDataset: false,
                    strokeWidth: 2,
                    propsForBackgroundLines: { strokeDasharray: '' },
                }}
                bezier
                style={styles.chart}
                withDots={true}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={true}
                withHorizontalLines={true}
                fromZero={true}
                getDotColor={(dataPoint, dataSetIndex) => {
                    return chartData.datasets[dataSetIndex]?.color(1) || '#000000';
                }}
            />
            {!selectedVital && (
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