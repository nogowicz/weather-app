import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import WeatherScreens from './screens/WeatherScreens';
import SearchScreen from './screens/SearchScreen';
import React from 'react';
import { store } from './store/redux/store';
import CityWeatherScreen from './screens/CityWeatherScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootStackParamList = {
  WeatherScreens: undefined;
  SearchScreen: undefined;
  CityWeatherScreen: undefined;
};

export default function App() {
  return (
    <Provider store={store}>
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

          <Stack.Screen
            name="CityWeatherScreen"
            component={CityWeatherScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_left'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

