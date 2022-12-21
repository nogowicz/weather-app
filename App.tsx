import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import MainScreen from './screens/MainScreen';
import {
  Ionicons,
} from '@expo/vector-icons';

import { locations } from './data/locations';
import { useRef } from 'react';

type Icon = keyof typeof Ionicons.glyphMap;

export default function App() {
  let img = require('./assets/sunnyDay.png');
  let background = '#CFDBBA'
  let weatherIcon: Icon = "md-sunny-outline"


  const scrollX = useRef(new Animated.Value(0)).current;
  return (
    <>
      <StatusBar style="auto" />
      <ScrollView
        horizontal={true}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX
                }
              }
            }
          ],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={1}
      >
        {locations.map((location, index) => {
          if (location.weatherType === "Sunny") {
            img = require('./assets/sunnyDay.png');
            weatherIcon = "md-sunny-outline"
            background = '#CFDBBA'
          } else if (location.weatherType === 'Rainy') {
            img = require('./assets/rainyDay.png');
            background = '#82B1D8'
            weatherIcon = "rainy-outline"
          } else if (location.weatherType === 'Snowy') {
            img = require('./assets/snowyDay.png')
            background = '#B8E8FC'
            weatherIcon = "md-snow-outline"
          } else if (location.weatherType === 'Stormy') {
            img = require('./assets/stormyDay.png')
            background = '#B1AFFF'
            weatherIcon = "md-thunderstorm-outline"
          }

          return (
            <MainScreen
              key={index}
              id={location.id}
              image={img}
              city={location.city}
              dateTime={location.dateTime}
              temperature={location.temperature}
              weatherType={location.weatherType}
              wind={location.wind}
              rain={location.rain}
              humidity={location.humidity}
              feelsLike={location.feelsLike}
              background={background}
              weatherIcon={weatherIcon}
            />
          )
        })}

      </ScrollView>

      <View style={styles.circleContainer}>
        {locations.map((location, index) => {
          const width = scrollX.interpolate(
            {
              inputRange: [
                windowWidth * (index - 1),
                windowWidth * (index),
                windowWidth * (index + 1)
              ],
              outputRange: [
                10, 20, 10
              ],
              extrapolate: 'clamp'
            }
          );
          return (
            <Animated.View
              key={index}
              style={[styles.circle, { width }]}
            />
          );
        })}
      </View>
    </>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  circle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 2,
    backgroundColor: 'black'
  },
  circleContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: '33%',
    right: (windowWidth / 2) - locations.length * 7,

  },
});