// HistoryChart kaavio näyttää vitaalit (mm. lämpötila) kaavioina. toimii historyscreenin ja datafetchinging kanssa yhteistyössä
import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text } from 'react-native';

const { width } = Dimensions.get('window');

const HistoryChart = ({ data }) => {
    //kaavio datan muodossa, joka sopii LineChart-komponentille
    const chartData = {
        labels: data.map(item => new Date(item.date).toLocaleDateString()), //päivämäärä
        datasets: [
            {
                data: data.map(item => item.vitals.temperature || 0), //  temperature
                strokeWidth: 2, //chart tyylittely
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

export default HistoryChart; //komponentti exportoidaan että  voidaan käyttää HistoryScreenissä

//https://github.com/indiespirit/react-native-chart-kit
