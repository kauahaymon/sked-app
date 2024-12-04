import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import GlobalStyles from "../../styles/GlobalStyles"

type Props = {
    title: string
    param: any
    icon?: any
    type?: any
}

export default function ItemArea({ icon, title, param }: Props) {
    return (
        <View style={styles.container} >
            <View style={styles.icon}>
                <MaterialIcons name={icon} size={21} color={GlobalStyles.colors.secundary} />
            </View>
            <View style={styles.item}>
                <Text style={[styles.text, { color: GlobalStyles.colors.secundary }]}>{title}</Text>
                {param === 'none' ? null : 
                <View style={styles.textBox}>
                    <Text style={[styles.text, { color: '#555', fontSize: 17 }]}>{param}</Text>
                </View>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    pressable: {
        flex: 1,
        paddingLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    icon: {
        height: 50,
        width: 41,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        flex: 1,
        borderColor: '#EBF0F7FF',
        borderBottomWidth: 1,
        height: 50,
        marginRight: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 18,
    },
    textBox: { 
        backgroundColor: '#EEEEEEFF', 
        paddingHorizontal: 7, 
        paddingVertical: 3, 
        borderRadius: 8,}
})