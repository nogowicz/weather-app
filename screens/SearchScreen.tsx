import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet, Dimensions, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native';
import { fetchCityList } from '../utils/data';
type RootStackParamList = {
    SearchScreen: undefined;
};


type ProfileScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'SearchScreen'
>;

type Props = {
    navigation: ProfileScreenNavigationProp;
};

function SearchScreen({ navigation }: Props) {
    const [locations, setLocations] = useState([{ name: '', country: { name: '' } }])
    const [searchValue, setSearchValue] = useState('')


    async function getLocations() {
        try {
            const location = await fetchCityList(searchValue)
            setLocations(location)

        } catch (error) {
            console.log(error)
        }
    }





    return (
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <View>
                    <Pressable
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24} color="black"
                            style={styles.icon}
                        />
                    </Pressable>
                </View>
                <View style={styles.searchBox}>
                    <TextInput
                        style={{
                            width: windowWidth * 0.65
                        }}
                        placeholder='Insert city name (ex. Warsaw)'
                        value={searchValue}
                        onChangeText={(text) => setSearchValue(text)}
                    />
                    <Pressable
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
                <Pressable>
                    <Ionicons
                        name="checkmark"
                        size={24} color="black"
                        style={styles.icon}
                    />
                </Pressable>
            </View>
            <View>
                {locations.map((loc, index) => {
                    if (loc.name != '') {
                        return (

                            <Pressable
                                onPress={() => {
                                    setSearchValue(loc.name)
                                }}
                                style={styles.record}
                                key={index}
                            >
                                <Text>{loc.name} - {loc.country.name}</Text>
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
    },
    icon: {
        marginHorizontal: 10,
    },
    searchBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: windowWidth * 0.75,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,

    },
    record: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
});