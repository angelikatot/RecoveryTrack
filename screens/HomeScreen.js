import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getUserProfile } from '../services/userProfileService';
import { useFonts } from 'expo-font';


const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
    const [userProfile, setUserProfile] = useState(null);
    const [daysSinceDischarge, setDaysSinceDischarge] = useState(null);
    const [location, setLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [fontsLoaded] = useFonts({
        CustomFont: require('../assets/fonts/Parkinsans-VariableFont_wght.ttf'),
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    // API avain poistettu turvallisuussyystä
    const apiKey = 'x';

    // Fetch user profile
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getUserProfile();
                if (profile) {
                    setUserProfile(profile);
                    calculateDaysSinceDischarge(profile.dateOfDischarge);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    // sijainti ja lähellä olevat sairaalat
    useEffect(() => {
        const getLocationAndHospitals = async () => {
            try {
                // Request location permissions
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    // Get current location
                    let location = await Location.getCurrentPositionAsync({});
                    const { latitude, longitude } = location.coords;

                    // Set location state
                    setLocation(location.coords);

                    // Fetch nearby hospitals
                    fetchNearbyHospitals(latitude, longitude);
                } else {
                    Alert.alert(
                        'Location Permission',
                        'Please enable location services to find nearby hospitals.'
                    );
                }
            } catch (error) {
                console.error('Location Error:', error);
                Alert.alert('Error', 'Could not retrieve location');
            }
        };

        getLocationAndHospitals();
    }, []);

    // Fetch nearby hospitals ( Google Places API)
    const fetchNearbyHospitals = (latitude, longitude) => {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=hospital&key=${apiKey}`;

        console.log('Fetching hospitals from URL:', url);

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log('Full API Response:', JSON.stringify(data, null, 2));

                if (data.status === 'OK' && data.results.length > 0) {
                    const validHospitals = data.results.filter(
                        hospital =>
                            hospital.geometry &&
                            hospital.geometry.location &&
                            hospital.geometry.location.lat &&
                            hospital.geometry.location.lng
                    );

                    console.log('Valid Hospitals Found:', validHospitals.length);
                    console.log('Hospital Names:', validHospitals.map(h => h.name));

                    setHospitals(validHospitals);
                } else {
                    console.error('Places API Error or No Results:', data.status);
                    Alert.alert('No Hospitals Found', 'No nearby hospitals could be retrieved.');
                }
            })
            .catch((error) => {
                console.error('Error fetching hospitals:', error);
                Alert.alert('Network Error', 'Could not fetch nearby hospitals');
            });
    };

    // montako päivää kotiutumisesta
    const calculateDaysSinceDischarge = (dischargeDate) => {
        const dischargeDateObj = new Date(dischargeDate);
        const today = new Date();
        const diffTime = Math.abs(today - dischargeDateObj);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        setDaysSinceDischarge(diffDays);
    };

    // tervehdys kellonajan mukaan
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <ImageBackground
            source={require('../assets/background3.png')}
            style={styles.background}
        >
            <View style={styles.container}>
                <Text style={styles.title}>RecoveryTrack</Text>

                {userProfile ? (
                    <View style={styles.greetingBox}>
                        <Text style={styles.greeting}>
                            {getGreeting()}, {userProfile.name}!
                            {'\n'}
                            Day {daysSinceDischarge} of recovery
                        </Text>
                    </View>
                ) : (
                    <View style={styles.greetingBox}>
                        <Text style={styles.greeting}>Loading profile...</Text>
                    </View>
                )}



                {/* Map with Hospitals */}
                {location && (
                    <View style={styles.mapContainer}>
                        <Text style={styles.overlayText}>
                            Your nearest healthcare centers
                        </Text>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1,
                            }}
                            showsUserLocation={true}
                        >
                            {hospitals.map((hospital, index) => (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: hospital.geometry.location.lat,
                                        longitude: hospital.geometry.location.lng,
                                    }}
                                    title={hospital.name}
                                    description={hospital.vicinity}
                                />
                            ))}
                        </MapView>
                    </View>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        fontFamily: 'CustomFont',
    },
    greetingBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        marginTop: 20,

        width: '80%',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
        color: '#333',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    mapContainer: {
        marginTop: 40,
        width: '90%',
        alignItems: 'center',
    },
    overlayText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        position: 'absolute',
        top: 10,
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        zIndex: 1,
    },
    map: {
        width: '100%',
        height: 250,
        borderRadius: 15,
    },
});
// https://stackoverflow.com/questions/18722477/how-to-find-nearby-hospitals-using-google-map-api-and-javascript
//https://developers.google.com/maps/documentation/geocoding/overview