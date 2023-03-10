import React from "react";
import {
    StyleSheet,
    View,
    Text,
} from "react-native";
import { useFonts } from 'expo-font';
import {
    Lato_900Black,
    Lato_400Regular,
    Lato_700Bold
} from '@expo-google-fonts/lato'
import Skeleton from "./Skeleton";

type Props = {
    children: JSX.Element,
    title: string,
    detail: string,
};

function WeatherDetail({ children, title, detail }: Props) {
    let [fontsLoaded] = useFonts({
        "Lato-Bold900": Lato_900Black,
        "Lato-Regular400": Lato_400Regular,
        "Lato-Bold700": Lato_700Bold
    })

    if (detail === 'undefined' || detail === 0 + ' km/h' || detail === 0 + ' m' || detail === 0 + ' %') {
        return (
            <View style={styles.container}>
                <View style={styles.icon}>
                    {children}
                </View>
                <View style={styles.info}>
                    <Text style={{
                        fontFamily: "Lato-Regular400",
                        fontSize: 15,
                        marginTop: 5,
                        color: '#C4C6CD'
                    }}>{title}</Text>
                    <Skeleton height={17} width={60} />
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.icon}>
                    {children}
                </View>
                <View style={styles.info}>
                    <Text style={{
                        fontFamily: "Lato-Regular400",
                        fontSize: 15,
                        marginTop: 5,
                        color: '#C4C6CD'
                    }}>{title}</Text>
                    <Text style={{
                        fontFamily: "Lato-Bold900",
                        fontSize: 17,
                        color: '#131235'
                    }}>{detail}</Text>
                </View>
            </View>
        );
    }
}

export default WeatherDetail;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 40,
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        backgroundColor: '#C4C6CD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        marginLeft: 10,
    },
});