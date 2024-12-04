import {
    TextInput,
    View,
    StyleSheet
} from "react-native"

type Props = {
    placeholder: string
}

export const InputArea = ({ placeholder }: Props) => {
    return (
        <View style={styles.group}>
            <TextInput style={styles.input} placeholder={placeholder} />
        </View>
    )
}
const styles = StyleSheet.create({
    group: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 45,
        marginTop: 15,
        width: '90%',
        borderRadius: 30,
        overflow: 'hidden'
    },
    icon: {
        borderRightWidth: 1,
        borderRightColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        paddingLeft: 15,
    }
})