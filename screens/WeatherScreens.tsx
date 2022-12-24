import {
    ScrollView,
    StyleSheet,
    View,
    Dimensions,
    Animated,
    RefreshControl,
} from 'react-native';
import MainScreen from './MainScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchWeatherData } from '../utils/data';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';

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

interface Weather {
    name: string,
    temp: any,
    city: string,
    date: string,
    wind: number,
    feelsLike: any,
    visibility: number,
    humidity: number,
    icon: string,
    description: string
}


function WeatherScreens({ navigation }: Props) {
    const route = useRoute<any>();
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");
    const [favoriteCities, setFavoriteCity] = useState(["Wacławice", "Kaszyce", "Lublin", "Przemyśl"])
    const [weatherData, setWeatherData] = useState<Weather>(
        // {
        //     name: 'Clear',
        //     temp: (10 + '°C'),
        //     city: "Lublin",
        //     date: 'Dec 12 2022 07:33',
        //     wind: 6,
        //     feelsLike: (10 + '°C'),
        //     visibility: 10000,
        //     humidity: 50,
        //     icon: '01d',
        //     description: 'sunny'
        // }
    );
    const [weatherArray, setWeatherArray] = useState([]);
    let img = require('../assets/sunnyDay.png');
    let background = '#CFDBBA'
    let weatherIcon: string = '01d.png'



    const scrollX = useRef(new Animated.Value(0)).current;

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);




    useEffect(() => {
        async function getWeatherData(city: string) {
            setIsFetching(true);
            try {
                await fetchWeatherData(city).then((weather) => {
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
                            icon: weather.icon,
                            description: weather.description
                        }
                    )
                })


            } catch (error) {
                setError("Could not fetch weather data")
                console.log("Fetching data error: ", error)
            }

        }

        favoriteCities.forEach(element => {
            getWeatherData(element)
        });
        setIsFetching(false);
    }, [])

    useEffect(() => {
        if (weatherData) {
            setWeatherArray(weatherArray => [...weatherArray, weatherData]);
        }
    }, [weatherData])



    // {"city": "Warsaw", "date": "Fri, 23 Dec 2022 15:26", "description": "mist", "feelsLike": "3°C", "humidity": 95, "icon": "50n", "name": "Mist", "temp": "6°C", "visibility": 3000, "wind": 3.09}, {"city": "Warsaw", "date": "Fri, 23 Dec 2022 15:26", "description": "mist", "feelsLike": "3°C", "humidity": 95, "icon": "50n", "name": "Mist", "temp": "6°C", "visibility": 3000, "wind": 3.09}
    if (weatherArray.length > 0) {
        console.log('data fetched' + weatherData[0])
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
                    {weatherArray.map((weather, index) => {
                        if (weatherArray) {
                            if (weather.description === 'clear sky' || weather.name === 'Clear') {
                                img = require('../assets/sunnyDay.png');
                                weatherIcon = "01d"
                                background = '#CFDBBA'
                            } else if (weather.description === 'few clouds') {
                                img = require('../assets/sunnyDay.png');
                                weatherIcon = "02d"
                                background = '#CFDBBA'
                            } else if (weather.description === 'scattered clouds') {
                                img = require('../assets/cloudyDay.png')
                                background = '#DFC395'
                                weatherIcon = "03d"
                            } else if (weather.description === 'broken clouds' || weather.name === 'Clouds') {
                                img = require('../assets/cloudyDay.png')
                                background = '#DFC395'
                                weatherIcon = "04d"
                            } else if (weather.description === 'shower rain' || weather.name === 'Drizzle') {
                                img = require('../assets/rainyDay.png');
                                background = '#82B1D8'
                                weatherIcon = "09d"
                            } else if (weather.description === 'rain' || weather.name === 'Rain') {
                                img = require('../assets/rainyDay.png');
                                background = '#82B1D8'
                                weatherIcon = "10d"
                            } else if (weather.description === 'snow' || weather.name === 'Snow') {
                                img = require('../assets/snowyDay.png')
                                background = '#B8E8FC'
                                weatherIcon = "13d"
                            } else if (weather.description === 'thunderstorm' || weather.name === 'Thunderstorm') {
                                img = require('../assets/stormyDay.png')
                                background = '#B1AFFF'
                                weatherIcon = "11d"
                            } else if (weather.description === 'mist' || weather.name === 'Smoke' || weather.name === 'Haze' || weather.name === 'Dust' || weather.name === 'Fog' || weather.name === 'Sand' || weather.name === 'Ash' || weather.name === 'Squall' || weather.name === 'Tornado' || weather.name === "Mist") {
                                img = require('../assets/cloudyDay.png')
                                background = '#DFC395'
                                weatherIcon = "50d"
                            }


                            return (
                                <MainScreen
                                    key={index}
                                    image={img}
                                    city={weather.city}
                                    dateTime={weather.date}
                                    temperature={weather.temp}
                                    weatherType={weather.name}
                                    wind={weather.wind}
                                    visibility={weather.visibility}
                                    humidity={weather.humidity}
                                    feelsLike={weather.feelsLike}
                                    background={background}
                                    weatherIcon={weatherIcon}
                                />
                            )
                        } else {
                            return (
                                <MainScreen
                                    key={index}
                                    image={require('../assets/stormyDay.png')}
                                    city={'No data'}
                                    dateTime={'No data'}
                                    temperature={'-°C'}
                                    weatherType={'No data'}
                                    wind={0}
                                    visibility={0}
                                    humidity={0}
                                    feelsLike={'-°C'}
                                    background={'#B1AFFF'}
                                    weatherIcon={"50d"}
                                />
                            )
                        }
                    })}


                </ScrollView>

                <View style={[styles.circleContainer, { right: (windowWidth / 2) - weatherArray.length * 7, }]}>
                    {weatherArray.map((weather, index) => {
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
    } else {
        console.log('data not fetched yet')
        return (
            <MainScreen
                image={require('../assets/stormyDay.png')}
                city={'No data'}
                dateTime={'No data'}
                temperature={'-°C'}
                weatherType={'No data'}
                wind={0}
                visibility={0}
                humidity={0}
                feelsLike={'-°C'}
                background={'#B1AFFF'}
                weatherIcon={"50d"}
            />
        )
    }

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


    },
});