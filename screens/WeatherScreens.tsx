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
import { fetchWeatherData } from '../utils/data';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadFavoriteCities } from '../store/redux/favoriteCities';
import { AnyAction, ThunkDispatch, createSelector } from '@reduxjs/toolkit';
type RootStackParamList = {
    WeatherScreens: undefined;
};

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
    const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
    const selectFavoriteCities = createSelector(
        (state) => state.favoriteCities.favoriteCities,
        (favoriteCities) => favoriteCities == null ? ['New York'] : favoriteCities
    );
    const favoriteCities = useSelector(state => selectFavoriteCities(state));
    const [favoriteCitiesUpdated, setFavoriteCitiesUpdated] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");
    const [weatherData, setWeatherData] = useState<Weather>();
    const [weatherArray, setWeatherArray] = useState([]);
    const [clearArray, setClearArray] = useState(false);
    const scrollViewRef = useRef(null);
    let img = require('../assets/problem.png');
    let background = '#DFECFD'
    let weatherIcon: string = '01d.png'

    const scrollX = useRef(new Animated.Value(0)).current;
    const [refreshing, setRefreshing] = useState(false);
    let requestCounter = 0
    async function getWeatherData(city: string) {
        requestCounter++;
        if (requestCounter > 55) {
            return "Nie mo??esz pobiera?? danych wi??cej ni?? 60 razy na minut??.";
        }
        const hour = (new Date()).getHours()
        const minutes = (new Date()).getMinutes()
        const dateAsString = (new Date()).toDateString() + " " + ((hour < 10) ? "0" + hour : hour) + ":" + ((minutes < 10) ? "0" + minutes : minutes)
        setIsFetching(true);
        try {
            console.log("Fetching data: " + city)
            await fetchWeatherData(city).then((weather) => {

                setWeatherData(
                    {
                        name: weather.name,
                        temp: (Math.floor(weather.temperature) + '??C'),
                        city: (weather.city.indexOf(' Voivodeship') != -1 ? weather.city.replace(' Voivodeship', '') : weather.city),
                        date: dateAsString,
                        wind: weather.wind,
                        feelsLike: (Math.floor(weather.feelsLike) + '??C'),
                        visibility: weather.visibility,
                        humidity: weather.humidity,
                        icon: weather.icon,
                        description: weather.description
                    }
                )


            })
            setIsFetching(false);

        } catch (error) {
            setError("Could not fetch weather data")
            console.log("Fetching data error: ", error)
            setIsFetching(false)
        }
    }

    useEffect(() => {
        dispatch(loadFavoriteCities())
        console.log(favoriteCities)
    }, []);




    useEffect(() => {
        setWeatherArray([])
        setClearArray(false);
    }, [clearArray]);

    useEffect(() => {
        if (!favoriteCitiesUpdated) {
            console.log("I'm before on Refresh and favoriteCities.length: ", favoriteCities.length)
            if (favoriteCities.length > 0) {
                console.log("I'm inside on Refresh and favoriteCities.length: ", favoriteCities.length)
                getElements();
                setFavoriteCitiesUpdated(true);
            }
        }

    }, [favoriteCities, favoriteCitiesUpdated])


    useEffect(() => {
        if (weatherData) {
            const cityExists = weatherArray.some(item => item.city === weatherData.city);
            if (!cityExists) {
                setWeatherArray(weatherArray => [...weatherArray, weatherData]);
            }
        }
    }, [weatherData])

    async function getElements() {
        console.log("I'm in get elements before loop and favoriteCities.length: ", favoriteCities.length)

        if (favoriteCities && favoriteCities.length > 0) {
            for await (const city of favoriteCities) {
                console.log("I'm inside for and favoriteCities.length: ", favoriteCities.length)
                await getWeatherData(city);
            };
        }


    }


    const onRefresh = useCallback(() => {
        console.log("I'm in onRefresh")
        setClearArray(true);
        setRefreshing(true);
        dispatch(loadFavoriteCities())
        console.log(favoriteCities)
        getElements().then(() => {
            setRefreshing(false);
        })

    }, [favoriteCities]) as () => void;

    if (weatherArray.length > 0) {
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
                                    <MainScreen
                                        image={require('../assets/problem.png')}
                                        city={'undefined'}
                                        dateTime={'undefined'}
                                        temperature={'und'}
                                        weatherType={'undefined'}
                                        wind={0}
                                        visibility={0}
                                        humidity={0}
                                        feelsLike={'undefined'}
                                        background={'#DFECFD'}
                                        weatherIcon={"undefined"}
                                    />
                                </ScrollView>
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
        return (

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
                <MainScreen
                    image={require('../assets/problem.png')}
                    city={'undefined'}
                    dateTime={'undefined'}
                    temperature={'und'}
                    weatherType={'undefined'}
                    wind={0}
                    visibility={0}
                    humidity={0}
                    feelsLike={'undefined'}
                    background={'#DFECFD'}
                    weatherIcon={"undefined"}
                />
            </ScrollView>
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