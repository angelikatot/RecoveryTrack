// HistoryChart.js
import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text } from 'react-native';

const { width } = Dimensions.get('window');

const HistoryChart = ({ data }) => {
    // Prepare chart data
    const chartData = {
        labels: data.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                data: data.map(item => item.vitals.temperature || 0), // Plot temperature
                strokeWidth: 2,
            },
        ],
    };

    return (
        <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Temperature History</Text>
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
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
};

export default HistoryChart;
