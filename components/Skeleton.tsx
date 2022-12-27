import React, { useEffect, useRef } from "react"
import { Animated } from "react-native"

type Props = {
    width: number,
    height: number
}
function Skeleton({ width, height }: Props) {
    const opacity = useRef(new Animated.Value(0.3));

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity.current, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 500,
                }),
                Animated.timing(opacity.current, {
                    toValue: 0.3,
                    useNativeDriver: true,
                    duration: 800
                })
            ])
        ).start();
    }, [opacity]);


    return (
        <Animated.View style={{ opacity: opacity.current, height, width, backgroundColor: "#ccc", borderRadius: 5, }} />
    )
}

export default Skeleton