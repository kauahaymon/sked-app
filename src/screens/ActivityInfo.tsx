import React, { useState, useEffect, useContext, useRef } from "react"
import {
    Octicons,
    MaterialIcons,
    AntDesign,
    MaterialCommunityIcons
} from '@expo/vector-icons'

import { useNavigation, useRoute } from "@react-navigation/native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from "react-native-safe-area-context"
import { format } from "date-fns/format"
import { StatusBar } from "expo-status-bar"
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from "moment"
import { ActivityContext } from "../context/ActivityProvider"
import ItemArea from "../components/button/ItemArea"

import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Alert,
    Text,
    Dimensions,
    Modal,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard
} from "react-native"

export default function ActivityInfo() {
    const navigation = useNavigation()
    const { params }: any = useRoute()

    const { roomList, deleteRoom, updateActivity, getTheme, getDescription, getConsiderations, getPerformance }: any = useContext(ActivityContext)

    const [showRoomMenu, setShowRoomMenu] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)

    const [updatedTheme, setUpdatedTheme] = useState(params.theme)
    const [updatedRoom, setUpdatedRoom] = useState(params.room)
    const [updatedDate, setUpdatedDate] = useState(new Date(params.date))
    const [updatedTime, setUpdatedTime] = useState(new Date(params.time))
    const [description, setDescripion] = useState('')
    const [considerations, setConsiderations] = useState('')

    const [studentData, setStudentData] = useState<any>([])
    const [newText, setNewText] = useState('')
    const [showInput, setShowInput] = useState(false)

    const [newComment, setNewComment] = useState('')

    const day = format(updatedDate, 'dd/MM/yyyy')
    const time = moment(updatedTime).format('HH:mm')

    const [isModalOpen, setIsModalOpen] = useState(false)

    const textDesc = getDescription(params.id) || ''
    const maxLength = 70
    const truncatedText = textDesc.length > maxLength
        ? `${textDesc.slice(0, maxLength)}...`
        : textDesc;

    const inputDescRef = useRef<any>(null)
    const commentRef = useRef<any>(null)
    useEffect(() => {
        if (isModalOpen) {
            setTimeout(() => {
                inputDescRef.current?.focus()
            }, 100)
        }
    }, [isModalOpen])

    useEffect(() => {
        if (showInput) {
            setTimeout(() => {
                commentRef.current?.focus()
            }, 100)
        }
    }, [showInput])

    useEffect(() => {
        if (params.theme) {
            setUpdatedTheme(params.theme)
        }
    }, [params.theme])

    const handleThemeTextChange = (id: number, theme: string) => {
        if (theme.trim() !== null) {
            setUpdatedTheme(theme)
            updateActivity(id, { theme: theme })
        }
        if (theme.trim() === '') {
            updateActivity(id, { theme: params.theme })
        }
    }

    const handleDescChange = (id: number, description: string) => {
        if (description.trim() !== null) {
            setDescripion(description)
            updateActivity(id, { description: description })
        }
    }

    const handleAddItem = () => {
        if (newText.trim() !== '') {
            updateActivity(params.id, {
                performance: [...(getPerformance(params.id) || []), { id: Math.random(), text: newText }]
            });
            setStudentData((prevData: any) => [...prevData, { id: Math.random(), text: newText }])
            setNewText('')
        }
        setTimeout(() => {
            commentRef.current?.focus();
        }, 100);
    }

    useEffect(() => {
        const performanceData = getPerformance(params.id) || []
        setStudentData(performanceData)
    }, [params.id])


    const handleConsChange = (id: number, considerations: string) => {
        if (considerations.trim() !== null) {
            setConsiderations(considerations)
            updateActivity(id, { considerations: considerations })
        }
    }

    const handleDateChange = (_event: any, selected?: any) => {
        setShowDatePicker(false)
        setUpdatedDate(selected)
        updateActivity(params.id, { date: selected })
    }

    const handleTimeChange = (_event: any, selected?: any) => {
        setShowTimePicker(false)
        setUpdatedTime(selected)
        updateActivity(params.id, { time: selected })
    }

    const handleDeleteRoom = (id: any) => {
        Alert.alert("Delete room?", "", [
            { text: "Cancel" },
            { text: "Ok", onPress: () => deleteRoom(id) },
        ])
    }

    function toggleModalVisibility() {
        setIsModalOpen(!isModalOpen)
    }

    function deleteStudent(id: number) {
        setStudentData(studentData.filter((student: any) => student.id !== id))
    }

    function handleBlur() {
        setShowInput(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="transparent" translucent />
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIcon} onPress={navigation.goBack}>
                    <MaterialIcons name="navigate-before" size={30} />
                </TouchableOpacity>
            </View>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.inputTheme}
                    placeholder={updatedTheme.trim() === '' ? params.theme : ''}
                    value={updatedTheme}
                    onChangeText={(text) => handleThemeTextChange(params.id, text)}
                    numberOfLines={3}
                    multiline={true}
                    maxLength={60}
                />
            </View>
            <ScrollView style={{ flex: 1, width: '100%', paddingBottom: 20 }}>
                <View style={{ flex: 1, width: Dimensions.get('window').width }}>
                    <View style={styles.itemsContainer}>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowRoomMenu(!showRoomMenu)}>
                            <ItemArea icon='door-front' title="Room" param={updatedRoom} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowDatePicker(true)}>
                            <ItemArea icon='event' title="Due Date" param={day} />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={new Date(params.date)}
                                mode='date'
                                display='default'
                                onChange={handleDateChange}
                            />
                        )}
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowTimePicker(true)}>
                            <ItemArea icon='access-time' title="Time" param={time} />
                        </TouchableOpacity>
                        {showTimePicker && (
                            <DateTimePicker
                                value={new Date(params.time)}
                                mode='time'
                                display='compact'
                                onChange={handleTimeChange}
                            />
                        )}

                        <TouchableOpacity activeOpacity={0.7} onPress={toggleModalVisibility}>
                            <ItemArea
                                icon="menu-book"
                                title="Class Description"
                                param={
                                    getDescription(params.id) === '' ?
                                        <MaterialCommunityIcons name="book-plus" size={19} color="#05AF2AFF" /> :
                                        <MaterialCommunityIcons name="book-edit" size={19} color="#7B7BD4FF" />
                                }
                            />
                            {params.id !== "" && truncatedText ? (
                                <Text
                                    style={{
                                        marginLeft: 45,
                                        marginTop: 7,
                                        marginBottom: 10,
                                        fontSize: 15,
                                        color: '#7c808f'
                                    }}
                                >
                                    {truncatedText}
                                </Text>
                            ) : null}

                        </TouchableOpacity>


                        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowInput(!showInput)}>
                            <ItemArea
                                icon="groups"
                                title="Student Performance"
                                param={showInput ?
                                    <MaterialIcons name="playlist-add-check" size={19} color="#7B7BD4FF" /> :
                                    <MaterialIcons name="person-add-alt-1" size={19} color="#05AF2AFF" />} />
                        </TouchableOpacity>
                        <View>
                            <FlatList
                                data={studentData}
                                keyExtractor={(item: any) => item.id}
                                renderItem={({ item }) => (
                                    <View style={{ width: '100%', flexDirection: 'row' }}>
                                        <View style={styles.studentView}>
                                            <Octicons name="dot-fill" size={13} color="#5C689EFF" />
                                            <Text style={styles.itemText}>{item.text}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => deleteStudent(item.id)} style={styles.deleteStudent}>
                                            <AntDesign name="close" size={13} color="#555" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>

                        {showInput && (
                            <View style={styles.inputContainer}>
                                <Octicons name="dot-fill" size={13} color="#5C689EFF" />
                                <TextInput
                                    ref={commentRef}
                                    style={styles.input}
                                    placeholder="Comment"
                                    value={newText}
                                    autoFocus={true}
                                    onChangeText={setNewText}
                                    onSubmitEditing={handleAddItem}
                                    onBlur={handleBlur}
                                />
                            </View>
                        )}

                        <ItemArea icon='description' title="Considerations" param={'none'} />
                        <View style={styles.consView}>
                            <TextInput placeholder="Type your considerations..."
                                value={getConsiderations(params.id)}
                                onChangeText={(text) => handleConsChange(params.id, text)}
                                multiline
                                style={styles.consInput} />
                        </View>
                        {showRoomMenu && (
                            <View style={styles.roomMenu}>
                                <FlatList
                                    style={{ backgroundColor: 'lightgray' }}
                                    keyboardShouldPersistTaps="handled"
                                    scrollEnabled={true}
                                    data={roomList}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={{
                                                padding: 10,
                                                backgroundColor: 'white',
                                            }}
                                            onPress={() => {
                                                setUpdatedRoom(item.title)
                                                updateActivity(params.id, { room: item.title })
                                                setShowRoomMenu(false)
                                            }}
                                            onLongPress={() => handleDeleteRoom(item.id)}
                                        >
                                            <Text style={{ color: '#616161FF', fontSize: 17 }}>{item.title}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}

                        {isModalOpen && (
                            <Modal
                                visible={isModalOpen}
                                transparent
                                animationType="slide"
                                onRequestClose={toggleModalVisibility}
                            >
                                <KeyboardAvoidingView
                                    style={styles.modalView}
                                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                >
                                    <View style={styles.descContainer}>
                                        <TouchableOpacity onPress={toggleModalVisibility} style={styles.closeIcon}>
                                            <MaterialIcons name="navigate-before" size={30} />
                                        </TouchableOpacity>
                                        <KeyboardAwareScrollView
                                            contentContainerStyle={{ flexGrow: 1 }}
                                            enableOnAndroid
                                            extraScrollHeight={20}
                                            keyboardShouldPersistTaps="handled"
                                        >
                                            <View style={styles.inputDescBox}>
                                                <TextInput
                                                    ref={inputDescRef}
                                                    value={getDescription(params.id)}
                                                    placeholder="Class description"
                                                    onChangeText={(text) => handleDescChange(params.id, text)}
                                                    multiline
                                                    numberOfLines={200}
                                                    style={[styles.inputDesc]}
                                                />
                                            </View>
                                        </KeyboardAwareScrollView>
                                    </View>
                                </KeyboardAvoidingView>
                            </Modal>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFFFF',
        alignItems: 'center',
    },
    header: {
        height: 45,
        width: '100%',
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIcon: {
        height: 40,
        width: 40,
        padding: 6,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputTheme: {
        color: '#555',
        fontSize: 24,
        textAlign: 'center',
        width: '100%',
        padding: 10,
    },
    inputBox: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    itemsContainer: {
        flex: 1,
        width: '100%',
    },
    roomMenu: {
        position: 'absolute',
        top: 38,
        right: 15,
        width: 180,
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 8,
        padding: 5,
        maxHeight: 300,
    },
    bottomSheetContainer: {
        height: 670,
        width: Dimensions.get('window').width,
        backgroundColor: '#f8f8f8',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        overflow: 'hidden',
    },
    dragIcon: {
        paddingVertical: 2,
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',

    },
    descContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderStartStartRadius: 20,
        borderEndStartRadius: 20,
    },
    closeIcon: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -10,
    },
    inputDesc: {
        fontSize: 17,
        height: '200%',
        textAlignVertical: 'top',
        lineHeight: 24,
    },
    inputDescBox: {
        flex: 1,
        marginBottom: 10,
        fontSize: 14
    },
    studentView: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        marginLeft: 35,
        padding: 7
    },
    consView: {
        marginLeft: 41,
        marginRight: 15,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        backgroundColor: '#f9f9f9',
        marginLeft: 33,
        marginRight: 15,
        marginBottom: 5,
    },
    input: {
        flex: 1,
        padding: 8,
        height: 40,
        fontSize: 15,
        color: '#555',
        marginLeft: 6,
    },
    itemText: {
        fontSize: 15,
        marginLeft: 10,
        color: '#7c808f',
    },
    deleteStudent: {
        width: 35,
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    consInput: {
        height: 150,
        textAlignVertical: 'top',
        fontSize: 15,
        color: '#7c808f',

        borderColor: '#F0F0F0FF',
        paddingLeft: 4,
    }
})
