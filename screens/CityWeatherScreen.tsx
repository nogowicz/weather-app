import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    Image,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { useFonts } from 'expo-font';
import {
    Lato_900Black,
    Lato_400Regular,
    Lato_700Bold
} from '@expo-google-fonts/lato'
import {
    AntDesign,
    MaterialCommunityIcons,
    Ionicons,
    FontAwesome5,
    Feather,
} from '@expo/vector-icons';
import WeatherDetail from '../components/WeatherDetail';
import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Skeleton from '../components/Skeleton';
import { useSelector, useDispatch } from 'react-redux';
import { setFavoriteCities } from '../store/redux/favoriteCities';
import { fetchWeatherData } from '../utils/data';
import { createSelector } from '@reduxjs/toolkit';

type RootStackParamList = {
    CityWeatherScreen: undefined;
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

function CityWeatherScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const dispatch = useDispatch();
    const selectFavoriteCities = createSelector(
        (state) => state.favoriteCities.favoriteCities,
        (favoriteCities) => favoriteCities == null ? ['New York'] : favoriteCities
    );
    const route = useRoute<any>();
    const { cityName } = route.params;
    const favoriteCities = useSelector(state => selectFavoriteCities(state));
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");
    const [weatherData, setWeatherData] = useState<Weather>();

    useEffect(() => {
        getWeatherData(cityName);
    }, [cityName]);


    async function getWeatherData(city: string) {
        const hour = (new Date()).getHours()
        const minutes = (new Date()).getMinutes()
        const dateAsString = (new Date()).toDateString() + " " + ((hour < 10) ? "0" + hour : hour) + ":" + ((minutes < 10) ? "0" + minutes : minutes)
        setIsFetching(true);
        try {
            console.log("Fetching data: ", city)
            await fetchWeatherData(city).then((weather) => {

                setWeatherData(
                    {
                        name: weather.name,
                        temp: (Math.floor(weather.temperature) + '°C'),
                        city: (weather.city.indexOf(' Voivodeship') != -1 ? weather.city.replace(' Voivodeship', '') : weather.city),
                        date: dateAsString,
                        wind: weather.wind,
                        feelsLike: (Math.floor(weather.feelsLike) + '°C'),
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
            navigation.goBack();
        }
    }
    let [fontsLoaded] = useFonts({
        "Lato-Bold900": Lato_900Black,
        "Lato-Regular400": Lato_400Regular,
        "Lato-Bold700": Lato_700Bold
    })
    if (!fontsLoaded) {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <ActivityIndicator size='large' color='#487db9' />
            </View>
        )
    }

    function toggleHeart() {
        if (favoriteCities.find((obj) => obj === weatherData.city)) {
            const newFavoriteCities = favoriteCities.filter(e => e !== weatherData.city);
            dispatch(setFavoriteCities({ favoriteCities: newFavoriteCities }))
        } else {
            let newFavoriteCities = [...favoriteCities];
            newFavoriteCities.push(weatherData.city)
            dispatch(setFavoriteCities({ favoriteCities: newFavoriteCities }))
        }
    }

    let img = require('../assets/problem.png');
    let background = '#DFECFD'
    let weatherIcon: string = '01d.png'
    if (weatherData) {
        if (weatherData.description === 'clear sky' || weatherData.name === 'Clear') {
            img = require('../assets/sunnyDay.png');
            weatherIcon = "01d"
            background = '#CFDBBA'
        } else if (weatherData.description === 'few clouds') {
            img = require('../assets/sunnyDay.png');
            weatherIcon = "02d"
            background = '#CFDBBA'
        } else if (weatherData.description === 'scattered clouds') {
            img = require('../assets/cloudyDay.png')
            background = '#DFC395'
            weatherIcon = "03d"
        } else if (weatherData.description === 'broken clouds' || weatherData.name === 'Clouds') {
            img = require('../assets/cloudyDay.png')
            background = '#DFC395'
            weatherIcon = "04d"
        } else if (weatherData.description === 'shower rain' || weatherData.name === 'Drizzle') {
            img = require('../assets/rainyDay.png');
            background = '#82B1D8'
            weatherIcon = "09d"
        } else if (weatherData.description === 'rain' || weatherData.name === 'Rain') {
            img = require('../assets/rainyDay.png');
            background = '#82B1D8'
            weatherIcon = "10d"
        } else if (weatherData.description === 'snow' || weatherData.name === 'Snow') {
            img = require('../assets/snowyDay.png')
            background = '#B8E8FC'
            weatherIcon = "13d"
        } else if (weatherData.description === 'thunderstorm' || weatherData.name === 'Thunderstorm') {
            img = require('../assets/stormyDay.png')
            background = '#B1AFFF'
            weatherIcon = "11d"
        } else if (weatherData.description === 'mist' || weatherData.name === 'Smoke' || weatherData.name === 'Haze' || weatherData.name === 'Dust' || weatherData.name === 'Fog' || weatherData.name === 'Sand' || weatherData.name === 'Ash' || weatherData.name === 'Squall' || weatherData.name === 'Tornado' || weatherData.name === "Mist") {
            img = require('../assets/cloudyDay.png')
            background = '#DFC395'
            weatherIcon = "50d"
        }

        if (weatherData) {
            return (
                <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
                    <View style={[styles.upperContainer, { backgroundColor: background }]}>
                        <View style={styles.topBar}>
                            <Pressable
                                style={({ pressed }) => (
                                    {
                                        width: 32,
                                        height: 32,
                                        borderRadius: 32 / 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: pressed ? '#000' : null,
                                        opacity: pressed ? 0.3 : null,
                                    }
                                )}
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={24} color="black"
                                />
                            </Pressable>
                            <View>
                                <Text style={{
                                    fontFamily: "Lato-Bold900",
                                    fontSize: 20,
                                    color: '#1C212F'
                                }}>{weatherData.city}</Text>
                                <Text style={{
                                    fontFamily: "Lato-Regular400",
                                    fontSize: 15,
                                    marginTop: 5,
                                    color: '#1C212F'
                                }}>{weatherData.date}</Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                            }}>
                                <Pressable
                                    style={({ pressed }) => (
                                        {
                                            width: 32,
                                            height: 32,
                                            borderRadius: 32 / 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: pressed ? '#000' : null,
                                            opacity: pressed ? 0.3 : null,
                                        }
                                    )}
                                    onPress={toggleHeart}
                                >
                                    {favoriteCities.find((obj) => obj === weatherData.city) ? <Ionicons name="heart" size={24} color="black" /> :
                                        <Ionicons name="heart-outline" size={24} color="black" />}
                                </Pressable>
                                <Pressable style={({ pressed }) => (
                                    {
                                        width: 32,
                                        height: 32,
                                        borderRadius: 32 / 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: pressed ? '#000' : null,
                                        opacity: pressed ? 0.3 : null,
                                        marginLeft: 10,
                                    }
                                )}
                                    onPress={() => {
                                        navigation.navigate('SearchScreen');
                                    }}
                                >
                                    <AntDesign
                                        name="plus"
                                        size={24}
                                        color='#1C212F'
                                    />
                                </Pressable>

                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={{ uri: `http://openweathermap.org/img/wn/${weatherIcon}@2x.png` }}
                                    style={{ width: 60, height: 60 }}
                                />
                                <Text style={{
                                    fontFamily: "Lato-Bold700",
                                    fontSize: 17,
                                    marginTop: 5,
                                    color: '#1C212F'
                                }}>{weatherData.name}</Text>
                            </View>
                            <View>
                                <Text style={{
                                    fontFamily: "Lato-Regular400",
                                    fontSize: 80,
                                    marginTop: 5,
                                    color: '#1C212F'
                                }}>{weatherData.temp}</Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={img}
                                style={
                                    {
                                        width: 270,
                                        height: 270,
                                        marginTop: 10,
                                    }}
                            />
                        </View>

                    </View>
                    <View style={styles.bottomInfo}>
                        <View style={
                            {
                                padding: 20,
                            }
                        }>
                            <Text style={{
                                fontFamily: "Lato-Bold900",
                                fontSize: 20,
                                color: '#1C212F'
                            }}>Weather now</Text>

                            <View style={styles.detailsContainer}>
                                <View style={styles.detailContainerColumn}>
                                    <WeatherDetail title='Feels like' detail={weatherData.feelsLike}>
                                        {parseInt(weatherData.temp) > 20 ?
                                            <FontAwesome5 name="temperature-high" size={20} color="black" /> :
                                            <FontAwesome5 name="temperature-low" size={20} color="black" />}
                                    </WeatherDetail>
                                    <WeatherDetail title='Visibility' detail={weatherData.visibility + ' m'}>
                                        <Ionicons name="eye-outline" size={24} color="black" />
                                    </WeatherDetail>
                                </View>
                                <View style={styles.detailContainerColumn}>
                                    <WeatherDetail title='Wind' detail={weatherData.wind + ' km/h'}>
                                        <Feather name="wind" size={24} color="black" />
                                    </WeatherDetail>
                                    <WeatherDetail title='Humidity' detail={weatherData.humidity + ' %'}>
                                        <Ionicons name="water-outline" size={24} color="black" />
                                    </WeatherDetail>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            );
        } else {
            return (
                <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
                    <View style={[styles.upperContainer, { backgroundColor: background }]}>
                        <View style={styles.topBar}>
                            <View>
                                <Skeleton height={20} width={100} />
                                <View style={{ marginTop: 5 }}>
                                    <Skeleton height={15} width={70} />
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                            }}>

                                <Pressable style={({ pressed }) => (
                                    {
                                        width: 32,
                                        height: 32,
                                        borderRadius: 32 / 2,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: pressed ? '#000' : null,
                                        opacity: pressed ? 0.3 : null,
                                        marginLeft: 10,
                                    }
                                )}
                                    onPress={() => {
                                        navigation.navigate('SearchScreen');
                                    }}
                                >
                                    <AntDesign
                                        name="plus"
                                        size={24}
                                        color='#1C212F'
                                    />
                                </Pressable>

                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={{ uri: `http://openweathermap.org/img/wn/${weatherIcon}@2x.png` }}
                                    style={{ width: 60, height: 60 }}
                                />
                                <Skeleton height={15} width={90} />
                            </View>
                            <View>
                                <Skeleton height={80} width={150} />
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={img}
                                style={
                                    {
                                        width: 270,
                                        height: 270,
                                        marginTop: 10,
                                    }}
                            />
                        </View>

                    </View>
                    <View style={styles.bottomInfo}>
                        <View style={
                            {
                                padding: 20,
                            }
                        }>
                            <Text style={{
                                fontFamily: "Lato-Bold900",
                                fontSize: 20,
                                color: '#1C212F'
                            }}>Weather now</Text>

                            <View style={styles.detailsContainer}>
                                <View style={styles.detailContainerColumn}>
                                    <WeatherDetail title='Feels like' detail={weatherData.feelsLike}>
                                        {parseInt(weatherData.temp) > 20 ?
                                            <FontAwesome5 name="temperature-high" size={20} color="black" /> :
                                            <FontAwesome5 name="temperature-low" size={20} color="black" />}
                                    </WeatherDetail>
                                    <WeatherDetail title='Visibility' detail={weatherData.visibility + ' m'}>
                                        <Ionicons name="eye-outline" size={24} color="black" />
                                    </WeatherDetail>
                                </View>
                                <View style={styles.detailContainerColumn}>
                                    <WeatherDetail title='Wind' detail={weatherData.wind + ' km/h'}>
                                        <Feather name="wind" size={24} color="black" />
                                    </WeatherDetail>
                                    <WeatherDetail title='Humidity' detail={weatherData.humidity + ' %'}>
                                        <Ionicons name="water-outline" size={24} color="black" />
                                    </WeatherDetail>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            );
        }
    }
}
export default CityWeatherScreen;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: windowWidth,
        paddingTop: 50,
    },
    upperContainer: {
        flex: 10,
        paddingHorizontal: 20,
    },
    bottomInfo: {
        backgroundColor: '#fff',
        flex: 5,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    detailContainerColumn: {
        marginHorizontal: 30,
    },

});