import React, {  useContext, useState } from "react"
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform,
} from "react-native"

import { StatusBar } from "expo-status-bar"
import { FontAwesome } from '@expo/vector-icons'
import { FlashList } from "@shopify/flash-list"

import { ActivityContext } from "../context/ActivityProvider"
import ActivityItem from "../components/ActivityItem"
import Button from "../components/button/ButtonAdd"
import FormModal from "./modal/Form"
import GlobalStyles from "../styles/GlobalStyles"

export default function Home() {
    const { activity, getCompletedCount, getPendingCount }: any = useContext(ActivityContext)
    const [formShown, setFormShown] = useState(false)
    const [pendingVisibility, setPendingVisibility] = useState(true)
    const [completedVisibility, setCompletedVisibility] = useState(true)

    const { blue } = GlobalStyles.colors

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <FlashList
                data={[]}
                estimatedItemSize={200}
                ListHeaderComponent={
                    <>
                        <View style={[styles.section, !pendingVisibility && styles.collapsed]}>
                            <TouchableOpacity onPress={() => setPendingVisibility(!pendingVisibility)}>
                                <Text style={styles.sectionTitle}>
                                    Pending {pendingVisibility ? getPendingCount() : null} {
                                        !pendingVisibility ?
                                            <FontAwesome name="caret-down" color={blue} size={15} />
                                            :
                                            <FontAwesome name="caret-up" color={'#7C7C7CFF'} size={15} />
                                    }
                                </Text>
                            </TouchableOpacity>
                            {pendingVisibility && (
                                <FlashList
                                    data={activity.filter((item: any) => !item.completed)}
                                    estimatedItemSize={100}
                                    showsVerticalScrollIndicator={false}

                                    keyExtractor={(item: any) => item.id.toString()}
                                    renderItem={({ item }) => <ActivityItem {...item} id={item.id} />
                                    }
                                    ListEmptyComponent={
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 1, marginBottom: 20 }} >
                                            <TouchableOpacity onPress={() => setFormShown(!formShown)}>
                                                <Text style={{ color: '#6E8FB3FF', textDecorationLine: 'underline', }} >No classes yet. Add one!</Text>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                />
                            )}
                        </View>
                        <View style={[styles.section, !completedVisibility && styles.collapsed]}>
                            <TouchableOpacity onPress={() => setCompletedVisibility(!completedVisibility)}>
                                <Text style={styles.sectionTitle}>
                                    Completed {completedVisibility ? getCompletedCount() : null} {
                                        !completedVisibility ?
                                            <FontAwesome name="caret-down" color={blue} size={15} />
                                            :
                                            <FontAwesome name="caret-up" color={'#7C7C7CFF'} size={15} />
                                    }
                                </Text>

                            </TouchableOpacity>
                            {completedVisibility && (
                                <FlashList
                                    data={activity.filter((item: any) => item.completed)}
                                    estimatedItemSize={100}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item: any) => item.id.toString()}
                                    renderItem={({ item }) => <ActivityItem {...item} id={item.id} />}
                                    ListEmptyComponent={
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 1, marginBottom: 20 }} >
                                            <Text style={{ color: '#6E8FB3FF' }} >Complete a classe to see it here!</Text>
                                        </View>
                                    }
                                />
                            )}
                        </View>
                    </>
                }
                renderItem={null}
            />

            <FormModal isVisible={formShown} onCancel={() => setFormShown(!formShown)} />

            <Button onPress={() => setFormShown(!formShown)} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 25 : 20,
        backgroundColor: '#f8f8f8'
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
    },
    section: {
        paddingHorizontal: 10,
    },
    collapsed: {
        height: 40,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 15,
        fontWeight: 'bold',
        color: '#313131FF'
    },
});
