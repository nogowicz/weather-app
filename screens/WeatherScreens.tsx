import {
    ScrollView,
    StyleSheet,
    View,
    Dimensions,
    Animated,
    RefreshControl,
} from 'react-native';
import MainScreen from './MainScreen';
import {
    Ionicons,
} from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


import { locations } from '../data/locations';
import { fetchWeatherData } from '../utils/data';
import React, { useState, useEffect, useRef, useCallback } from 'react';

type Icon = keyof typeof Ionicons.glyphMap;

type RootStackParamList = {
    WeatherScreens: undefined;
};

const wait = (timeout: any) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
type ProfileScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'WeatherScreens'
>;

type Props = {
    navigation: ProfileScreenNavigationProp;
};

function WeatherScreens({ navigation }: Props) {
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");
    const [weatherData, setWeatherData] = useState<
        {
            name: string,
            temp: any,
            city: string,
            date: string,
            wind: number,
            feelsLike: any,
            visibility: number,
            humidity: number,
        }
    >({
        name: "Sunny",
        temp: 20 + '°C',
        city: 'New York',
        date: 'Thu, 22 Dec 2022 22:20:40 GMT',
        wind: 6.55,
        feelsLike: 0 + '°C',
        visibility: 10000,
        humidity: 96,
    })
    let img = require('../assets/sunnyDay.png');
    let background = '#CFDBBA'
    let weatherIcon: Icon = "md-sunny-outline"


    const scrollX = useRef(new Animated.Value(0)).current;

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        async function getWeatherData() {
            setIsFetching(true);
            try {
                const weather = await fetchWeatherData('Warszawa');
                setWeatherData(
                    {
                        name: weather.name,
                        temp: (Math.floor(weather.temperature) + '°C'),
                        city: weather.city,
                        date: (weather.date).slice(0, -7),
                        wind: weather.wind,
                        feelsLike: (Math.floor(weather.feelsLike) + '°C'),
                        visibility: weather.visibility,
                        humidity: weather.humidity,
                    }
                )
            } catch (error) {
                setError("Could not fetch weather data")
                console.log('lalal')
            }
            setIsFetching(false);
        }
        getWeatherData();
    }, [onRefresh]);
    return (
        <>

            <ScrollView
                horizontal={true}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
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
                    if (weatherData.name === 'Sunny') {
                        img = require('../assets/sunnyDay.png');
                        weatherIcon = "md-sunny-outline"
                        background = '#CFDBBA'
                    } else if (weatherData.name === 'Rainy') {
                        img = require('../assets/rainyDay.png');
                        background = '#82B1D8'
                        weatherIcon = "rainy-outline"
                    } else if (weatherData.name === 'Snowy') {
                        img = require('../assets/snowyDay.png')
                        background = '#B8E8FC'
                        weatherIcon = "md-snow-outline"
                    } else if (weatherData.name === 'Stormy') {
                        img = require('../assets/stormyDay.png')
                        background = '#B1AFFF'
                        weatherIcon = "md-thunderstorm-outline"
                    } else if (weatherData.name === 'Clouds' || weatherData.name === 'Mist') {
                        img = require('../assets/cloudyDay.png')
                        background = '#DFC395'
                        weatherIcon = "cloud-outline"
                    }

                    return (
                        <MainScreen
                            key={index}
                            id={location.id}
                            image={img}
                            city={weatherData.city}
                            dateTime={weatherData.date}
                            temperature={weatherData.temp}
                            weatherType={weatherData.name}
                            wind={weatherData.wind}
                            visibility={weatherData.visibility}
                            humidity={weatherData.humidity}
                            feelsLike={weatherData.feelsLike}
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

export default WeatherScreens;


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