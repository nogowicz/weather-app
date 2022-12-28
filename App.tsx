import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import WeatherScreens from './screens/WeatherScreens';
import SearchScreen from './screens/SearchScreen';
import React from 'react';
import { store } from './store/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootStackParamList = {
  WeatherScreens: undefined;
  SearchScreen: undefined
};

export default function App() {
  AsyncStorage.getItem('favoriteCities', (error, result) => {
    if (result === null) {
      AsyncStorage.setItem('favoriteCities', JSON.stringify(['London']));
    }
  });
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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

