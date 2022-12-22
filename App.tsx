import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WeatherScreens from './screens/WeatherScreens';
import SearchScreen from './screens/SearchScreen';
import React from 'react';

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootStackParamList = {
  WeatherScreens: undefined;
  SearchScreen: undefined
};

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="WeatherScreens"
            component={WeatherScreens}
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}

