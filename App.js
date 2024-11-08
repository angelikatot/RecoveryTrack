import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable } from 'react-native';
import InputScreen from './screens/InputScreen';
import HistoryScreen from './screens/HistoryScreen';
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import { auth } from './services/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser);
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
          <Stack.Screen
            name="App"
            children={() => <AppScreens handleSignOut={handleSignOut} />}
            options={{ headerShown: false }}
          />
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

function AppScreens({ handleSignOut }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'HomeScreen') iconName = 'home-outline';
          else if (route.name === 'InputScreen') iconName = 'create-outline';
          else if (route.name === 'HistoryScreen') iconName = 'time-outline';
          else if (route.name === 'SignOut') iconName = 'log-out-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarButton: (props) =>
          route.name === 'SignOut' ? (
            <Pressable
              {...props}
              onPress={handleSignOut}
              style={({ pressed }) => [
                props.style,
                pressed && { opacity: 0.5 },
              ]}
            />
          ) : (
            <Pressable {...props} />
          ),
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="InputScreen" component={InputScreen} options={{ title: 'Input' }} />
      <Tab.Screen name="HistoryScreen" component={HistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="SignOut" component={SignOutPlaceholder} options={{ title: 'Sign Out' }} />
    </Tab.Navigator>
  );
}

// Placeholder component for SignOut
function SignOutPlaceholder() {
  return null; // Empty component as placeholder for the sign-out functionality
}
