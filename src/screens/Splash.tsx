import { Image, StyleSheet, View } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export default function Splash() {

    const navigation: any = useNavigation()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Home')
        }, 1500);

        return () => clearTimeout(timer)
    }, [navigation])

    return (
        <View style={styles.container} >
            <Image source={require('../../assets/splash-icon.png')} style={styles.image} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GlobalStyles.colors.secundary
    },
    image: {
        height: 120,
        width: 120,
        resizeMode: 'contain',
    }
})