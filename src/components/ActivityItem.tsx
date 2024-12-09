import React, { useContext, useRef, useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    Alert,
} from "react-native"

import moment from 'moment'
import { format } from 'date-fns'
import { AntDesign, FontAwesome5, FontAwesome6, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'

import { ActivityContext } from "../context/ActivityProvider"
import GlobalStyles from "../styles/GlobalStyles"

type Props = {
    id: any
    theme: string
    room: any
    date: Date
    time: Date
    completed: boolean
    transitioning?: boolean
};

export default function ActivityItem(props: Props) {
    const { toggleActivityCompletion, deleteActivity, moveToArchived, getDescription, getConsiderations, getPerformance }: any = useContext(ActivityContext)
    const formattedDate = moment(props.date).format("DD/MM")
    const formattedTime = `${format(props.time, "HH")}h`
    const { navigate } = useNavigation();

    const today = moment().startOf("day");
    const givenDate = moment(props.date).startOf("day");

    const doneStyle: any = props.completed
        ? {
            textDecorationLine: "line-through",
            color: GlobalStyles.colors.blue,
        }
        : {}

    const handleDeleteActivity = () => {
        Alert.alert("Delete class?", "", [
            { text: "Cancel" },
            { text: "Ok", onPress: () => deleteActivity(props.id) },
        ])
    }

    const getRightContent = () => (
        <TouchableOpacity style={styles.rightContent} onPress={handleDeleteActivity}>
            <Feather name="trash-2" color={"white"} size={22} />
        </TouchableOpacity>
    )

    function goToActivityInfo() {
        navigate("ActivityInfo", { ...props });
    }


    const getLeftContent = () => (
        <TouchableOpacity style={styles.LeftContent}>
            <Feather name="archive" color={'white'} size={22} />
        </TouchableOpacity>
    )

    let labelDate;
    if (givenDate.isSame(today, "day")) {
        labelDate = "Today";
    } else if (givenDate.isBefore(today, "day")) {
        labelDate = "Yesterday";
    } else if (givenDate.isSame(today.add(1, "days"), "day")) {
        labelDate = "Tomorrow";
    } else {
        labelDate = formattedDate;
    }

    return (
        <Swipeable renderRightActions={getRightContent}
            renderLeftActions={undefined}
            friction={1.2}
            containerStyle={{ borderRadius: 10 }}
            onSwipeableOpen={(direction) => {
                if (direction === 'right') {
                    moveToArchived(props.id)
                }
            }}
            dragOffsetFromRightEdge={0}
            overshootRight={false}
        >
            <View style={styles.container}>
                <View style={styles.checkBoxContainer}>
                    <Pressable
                        role="checkbox"
                        aria-checked={props.completed}
                        style={[
                            styles.checkboxBase,
                            (props.completed || props.transitioning) && styles.checkboxChecked,
                        ]}
                        onPress={() => toggleActivityCompletion(props.id)}
                    >
                        {(props.completed || props.transitioning) && (
                            <FontAwesome5 name="check" size={11} color="white" />
                        )}
                    </Pressable>
                </View>
                <Pressable onPress={goToActivityInfo}>
                    <View style={styles.itemContainer}>
                        <Text style={[styles.title, doneStyle]}>{props.theme}</Text>
                        <View style={styles.infos}>
                            <Text style={styles.subtitle}>
                                {props.room} {formattedTime}
                                {getDescription(props.id) ||
                                    getPerformance(props.id) && getPerformance(props.id).length > 0 ||
                                    getConsiderations(props.id) ? (
                                    <> |</>
                                ) : null}
                                {getDescription(props.id) ? (
                                    <> <Feather name="book" size={10} color="#7c808f" /></>
                                ) : null}
                                {getPerformance(props.id) && getPerformance(props.id).length > 0 ? (
                                    <> <MaterialCommunityIcons name="account-multiple-outline" size={12} color="#7c808f" /></>
                                ) : null}
                                {getConsiderations(props.id) ? (
                                    <> <Feather name="file-text" size={10} color="#7c808f" /></>
                                ) : null}
                            </Text>


                            <Text style={[styles.subtitle, { color: GlobalStyles.colors.blue }]}>{labelDate}</Text>
                        </View>
                    </View>
                </Pressable>
            </View>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 65,
        flexDirection: 'row',
        backgroundColor: '#FFFFFFFF',
        marginBottom: 7,
        borderRadius: 10,
    },
    itemContainer: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 75,
    },
    infos: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 17,
        color: '#555',
        fontWeight: '500',
    },
    subtitle: {
        fontSize: 13,
        color: '#7c808f'
    },
    checkBoxContainer: {
        width: '15%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    checkboxChecked: {
        backgroundColor: GlobalStyles.colors.blue,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    checkboxBase: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 21,
        height: 21,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: '#B3BCDBFF'
    },
    rightContent: {
        height: 65,
        width: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 14,
        borderTopRightRadius: 14
    },
    LeftContent: {
        height: 65,
        width: '85%',
        backgroundColor: GlobalStyles.colors.blue,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 15,
        borderRadius: 15,
    }
})
