import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native';

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
    return (
        <View style={styles.container}>
            <View style={styles.upperConatiner}>
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
                    />
                    <Ionicons
                        name="search"
                        size={24}
                        color="black"
                        style={{ marginLeft: 5 }}
                    />
                </View>
            </View>
            <View>
                <View style={styles.record}>

                </View>
                <View style={styles.record}>

                </View>
                <View style={styles.record}>

                </View>
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
    upperConatiner: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginHorizontal: 10,
    },
    searchBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: windowWidth * 0.8,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    record: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        height: 40,
    },
});