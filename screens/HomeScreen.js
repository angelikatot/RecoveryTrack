import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View>
            <Text>Today’s Summary</Text>
            <Button
                title="Add Today's Data"
                onPress={() => navigation.navigate('Input')}
            />
            <Button
                title="View History"
                onPress={() => navigation.navigate('History')}
            />
        </View>
    );
}
