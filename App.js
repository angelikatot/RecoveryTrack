import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InputScreen from './screens/InputScreen';
import HistoryScreen from './screens/HistoryScreen';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import DailyVitalsScreen from './screens/DailyVitalsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileDetailsScreen from './screens/ProfileDetailsScreen';
import AuthScreen from './screens/AuthScreen';
import { auth } from './services/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        console.log('Current authenticated user:', currentUser.uid);
        setUser(currentUser);
      } else {
        console.log('No user is authenticated');
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="App"
              component={AppScreens}
              initialParams={{ handleSignOut }}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DailyVitalsScreen"
              component={DailyVitalsScreen}
              options={{ title: 'Daily Vitals' }}
            />
            <Stack.Screen
              name="ProfileDetailsScreen"
              component={ProfileDetailsScreen}
              options={{ title: 'Edit Profile' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AppScreens() {
  const route = useRoute();
  const handleSignOut = route.params.handleSignOut;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'HomeScreen') iconName = 'home-outline';
          else if (route.name === 'InputScreen') iconName = 'create-outline';
          else if (route.name === 'HistoryScreen') iconName = 'time-outline';
          else if (route.name === 'CalendarScreen') iconName = 'calendar-outline';
          else if (route.name === 'ProfileScreen') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="InputScreen" component={InputScreen} options={{ title: 'Input' }} />
      <Tab.Screen name="HistoryScreen" component={HistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="CalendarScreen" component={CalendarScreen} options={{ title: 'Calendar' }} />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
        initialParams={{ handleSignOut }}
      />
    </Tab.Navigator>
  );
}