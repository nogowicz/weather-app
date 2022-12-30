import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Dimensions, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native';
import { fetchCityList } from '../utils/data';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setFavoriteCities } from '../store/redux/favoriteCities';


function SearchScreen() {
    const dispatch = useDispatch();
    const favoriteCities = useSelector((state: { favoriteCities }) => state.favoriteCities.favoriteCities);
    const [locations, setLocations] = useState([{ name: '', country: { name: '' } }])
    const [searchValue, setSearchValue] = useState('');
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    async function getLocations() {
        try {
            const location = await fetchCityList(searchValue)
            setLocations(location)

        } catch (error) {
            console.log(error)
        }
    }



    function toggleHeart(city) {
        if (favoriteCities.find((obj) => obj === city)) {
            const newFavoriteCities = favoriteCities.filter(e => e !== city);
            dispatch(setFavoriteCities({ favoriteCities: newFavoriteCities }))
        } else {
            let newFavoriteCities = [...favoriteCities];
            newFavoriteCities.push(city)
            dispatch(setFavoriteCities({ favoriteCities: newFavoriteCities }))
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <View>
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
                </View>
                <View style={styles.searchBox}>
                    <TextInput
                        style={{
                            width: windowWidth * 0.55
                        }}
                        placeholder='Insert city name (ex. Warsaw)'
                        value={searchValue}
                        onChangeText={(text) => setSearchValue(text)}
                    />
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
                        onPress={() => getLocations()}
                    >
                        <Ionicons
                            name="search"
                            size={24}
                            color="black"
                            style={{ marginLeft: 5 }}
                        />
                    </Pressable>

                </View>
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
                    onPress={() => {
                        if (searchValue.length > 0) {
                            navigation.navigate('CityWeatherScreen', {
                                cityName: searchValue
                            })
                        }
                    }}
                >
                    <Ionicons name="add" size={24} color="black" />
                </Pressable>
            </View>
            <View>
                {locations.map((loc, index) => {
                    if (loc.name != '') {
                        return (

                            <Pressable
                                style={styles.record}
                                key={index}
                                onPress={() => {
                                    setSearchValue(loc.name);
                                    if (searchValue.length > 0) {
                                        navigation.navigate('CityWeatherScreen', {
                                            cityName: loc.name
                                        })
                                    }
                                }}
                            >

                                <Text>{loc.name} - {loc.country.name}</Text>
                                <Pressable
                                    onPress={() => {
                                        toggleHeart(loc.name)
                                    }}
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
                                >
                                    {favoriteCities.find((obj) => obj === loc.name) ? <Ionicons name="heart" size={24} color="black" /> :
                                        <Ionicons name="heart-outline" size={24} color="black" />}
                                </Pressable>
                            </Pressable>
                        )
                    }
                })}



            </View>
        </View>
    );
}

export default SearchScreen

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 50,
    },
    upperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 10,
    },
    searchBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: windowWidth * 0.68,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginHorizontal: 10,

    },
    record: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        height: 40,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
});