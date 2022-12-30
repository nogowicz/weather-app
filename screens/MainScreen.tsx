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
import React, { useState } from 'react';
import { Pressable } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Skeleton from '../components/Skeleton';
import { useSelector, useDispatch } from 'react-redux';
import { setFavoriteCities } from '../store/redux/favoriteCities';
import { createSelector } from '@reduxjs/toolkit';

type Props = {
    image: any,
    city: string,
    dateTime: string,
    temperature: string,
    weatherType: string,
    wind: number,
    visibility: number,
    humidity: number,
    feelsLike: string,
    background: string,
    weatherIcon: string
};

function MainScreen({ image, city, dateTime, temperature, weatherType, wind, visibility, humidity, feelsLike, background, weatherIcon }: Props) {
    const dispatch = useDispatch();
    const selectFavoriteCities = createSelector(
        (state) => state.favoriteCities.favoriteCities,
        (favoriteCities) => favoriteCities == null ? ['New York'] : favoriteCities
    );
    const favoriteCities = useSelector(state => selectFavoriteCities(state));
    const [isFetching, setIsFetching] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    let [fontsLoaded] = useFonts({
        "Lato-Bold900": Lato_900Black,
        "Lato-Regular400": Lato_400Regular,
        "Lato-Bold700": Lato_700Bold
    })
    if (!fontsLoaded) {
        return (
            <View style={{ width: windowWidth, justifyContent: 'center', alignItems: 'center', }}>
                <ActivityIndicator size='large' color='#487db9' />
            </View>
        )
    }

    function toggleHeart() {
        if (favoriteCities.find((obj) => obj === city)) {
            const newFavoriteCities = favoriteCities.filter(e => e !== city);
            dispatch(setFavoriteCities({ favoriteCities: newFavoriteCities }))
        } else {
            let newFavoriteCities = [...favoriteCities];
            newFavoriteCities.push(city)
            dispatch(setFavoriteCities({ favoriteCities: newFavoriteCities }))
        }
    }

    if (city != 'undefined') {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
                <View style={[styles.upperContainer, { backgroundColor: background }]}>
                    <View style={styles.topBar}>
                        <View>
                            <Text style={{
                                fontFamily: "Lato-Bold900",
                                fontSize: 20,
                                color: '#1C212F'
                            }}>{city}</Text>
                            <Text style={{
                                fontFamily: "Lato-Regular400",
                                fontSize: 15,
                                marginTop: 5,
                                color: '#1C212F'
                            }}>{dateTime}</Text>
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
                                {favoriteCities.find((obj) => obj === city) ? <Ionicons name="heart" size={24} color="black" /> :
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
                            )}>
                                <MaterialCommunityIcons
                                    name="sort-variant"
                                    size={24}
                                    color='#1C212F'
                                    style={{
                                        transform: [{ scaleX: -1 }],
                                    }}
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
                            }}>{weatherType}</Text>
                        </View>
                        <View>
                            <Text style={{
                                fontFamily: "Lato-Regular400",
                                fontSize: 80,
                                marginTop: 5,
                                color: '#1C212F'
                            }}>{temperature}</Text>
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={image}
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
                                <WeatherDetail title='Feels like' detail={feelsLike}>
                                    {parseInt(temperature) > 20 ?
                                        <FontAwesome5 name="temperature-high" size={20} color="black" /> :
                                        <FontAwesome5 name="temperature-low" size={20} color="black" />}
                                </WeatherDetail>
                                <WeatherDetail title='Visibility' detail={visibility + ' m'}>
                                    <Ionicons name="eye-outline" size={24} color="black" />
                                </WeatherDetail>
                            </View>
                            <View style={styles.detailContainerColumn}>
                                <WeatherDetail title='Wind' detail={wind + ' km/h'}>
                                    <Feather name="wind" size={24} color="black" />
                                </WeatherDetail>
                                <WeatherDetail title='Humidity' detail={humidity + ' %'}>
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
                                }
                            )}>
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
                                    {favoriteCities.find((obj) => obj === city) ? <Ionicons name="heart" size={24} color="black" /> :
                                        <Ionicons name="heart-outline" size={24} color="black" />}
                                </Pressable>
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
                            )}>
                                <MaterialCommunityIcons
                                    name="sort-variant"
                                    size={24}
                                    color='#1C212F'
                                    style={{
                                        transform: [{ scaleX: -1 }],
                                    }}
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
                            source={image}
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
                                <WeatherDetail title='Feels like' detail={feelsLike}>
                                    {parseInt(temperature) > 20 ?
                                        <FontAwesome5 name="temperature-high" size={20} color="black" /> :
                                        <FontAwesome5 name="temperature-low" size={20} color="black" />}
                                </WeatherDetail>
                                <WeatherDetail title='Visibility' detail={visibility + ' m'}>
                                    <Ionicons name="eye-outline" size={24} color="black" />
                                </WeatherDetail>
                            </View>
                            <View style={styles.detailContainerColumn}>
                                <WeatherDetail title='Wind' detail={wind + ' km/h'}>
                                    <Feather name="wind" size={24} color="black" />
                                </WeatherDetail>
                                <WeatherDetail title='Humidity' detail={humidity + ' %'}>
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

export default MainScreen;

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