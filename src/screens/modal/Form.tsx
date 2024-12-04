import React, { useContext, useRef, useState, useEffect } from "react"
import {
    ToastAndroid,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    KeyboardAvoidingView,
    FlatList,
    Alert,
} from "react-native"

import moment from 'moment'
import { format } from "date-fns"
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from "@expo/vector-icons"

import { ActivityContext } from "../../context/ActivityProvider"
import GlobalStyles from "../../styles/GlobalStyles"

type Props = {
    isVisible: boolean;
    onCancel: VoidFunction;
}

interface Room {
    id: number
    title: string
}

export default function FormModal({ isVisible, onCancel }: Props) {

    const { createActivity, addNewRoom, roomList, deleteRoom }: any = useContext(ActivityContext)
    const [room, setRoom] = useState('Select Room')
    const [theme, setTheme] = useState('')
    const [date, setDate] = useState(new Date())
    const [displayedDate, setDisplayedDate] = useState('Today')
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [time, setTime] = useState(new Date())
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [displayedTime, setDisplayedTime] = useState('Time')
    const [showAddRoomModal, setShowAddRoomModal] = useState(false)

    const [newRoom, setNewRoom] = useState('')

    const classInputRef = useRef<TextInput>(null);
    const roomInputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (isVisible) {
            setTimeout(() => {
                classInputRef.current?.focus();
                roomInputRef.current?.focus()
            }, 100);
        }
    }, [isVisible]);


    function RoomSelector() {
        return (
            <TouchableOpacity style={styles.optionButton} onPress={() => setShowMenu(!showMenu)}>
                <Text style={{ color: 'white' }}>{room}</Text>
            </TouchableOpacity>
        )
    }

    function DatePicker() {

        const handleDateChange = (_event: any, selectedDate?: Date) => {
            setShowDatePicker(false)
            if (selectedDate) {
                const today = new Date()
                const formattedDate = moment(selectedDate).format('DD MMM')
                setDate(selectedDate)
                if (selectedDate.toDateString() === today.toDateString()) {
                    setDisplayedDate('Today')
                } else {
                    setDisplayedDate(formattedDate)
                }
            }
        }

        let datePicker = <DateTimePicker
            value={date}
            onChange={handleDateChange}
            mode="date"
            display="calendar"
        />

        if (Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity style={styles.optionButton} onPress={() => {
                        setShowDatePicker(!showDatePicker)
                        setShowMenu(false)
                    }}>
                        <Ionicons name="calendar-number" size={15} color={'white'} />
                        <Text style={{ marginLeft: 6, color: 'white' }}>
                            {displayedDate}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && datePicker}
                </View>
            )
        }
        return datePicker;
    }

    function TimePiker() {
        const handleTimeChange = (_event: any, selectedTime?: Date) => {
            setShowTimePicker(false)
            if (selectedTime) {
                selectedTime.setMinutes(0)
                selectedTime.setSeconds(0)
                selectedTime.setMilliseconds(0)
                const formattedTime = `${format(selectedTime, 'HH')}h`
                setDisplayedTime(formattedTime)
                setTime(selectedTime)
            }
        }

        let timePicker = <DateTimePicker
            value={time}
            onChange={handleTimeChange}
            mode="time"
            display="default"
            themeVariant="light"
        />

        if (Platform.OS === 'android') {
            return timePicker = (
                <View>
                    <TouchableOpacity onPress={() => {
                        setShowTimePicker(!showTimePicker)
                        setShowMenu(false)
                    }}
                        style={styles.optionButton}
                    >
                        <Ionicons name="time" size={17} color={'#D9E4E7FF'} />
                        <Text style={{ marginLeft: 6, color: 'white' }}>
                            {displayedTime}
                        </Text>
                    </TouchableOpacity>
                    {showTimePicker && timePicker}
                </View>
            )
        }
    }

    function handleReset() {
        onCancel()
        setTheme('')
        setDate(new Date())
        setRoom('Select Room')
        setDisplayedDate('Today')
        setDisplayedTime('Time')
    }

    const handleAddActivity = () => {
        if (theme.trim() === '')
            ToastAndroid.show("Please enter the class topic!", ToastAndroid.SHORT)
        else if (room === 'Select Room')
            ToastAndroid.show("No room selected!", ToastAndroid.SHORT)
        else if (displayedTime === 'Time')
            ToastAndroid.show("Please enter a time!", ToastAndroid.SHORT)
        else {
            createActivity({ theme, room, date, time })
            onCancel()
            handleReset()
        }
    }

    const handlAddNewRoom = () => {
        if (newRoom.trim() !== '') {
            const newRoomData: Room = { id: Math.random(), title: newRoom };
            addNewRoom(newRoomData);
            setShowAddRoomModal(false);
            setRoom(newRoom);
            setNewRoom('');
        } else {
            ToastAndroid.show("Please enter a room name!", ToastAndroid.SHORT);
        }
    }

    const handleDeleteRoom = (id: any) => {
        Alert.alert("Delete room?", "", [
            { text: "Cancel" },
            { text: "Ok", onPress: () => deleteRoom(id) },
        ])
    }

    return (
        <View>
            <Modal transparent={true} visible={isVisible} onRequestClose={handleReset} animationType="fade">
                <TouchableWithoutFeedback onPress={() => {
                    onCancel()
                    setShowMenu(false)
                    handleReset()
                }}>
                    <View style={styles.overlay}>
                        <KeyboardAvoidingView
                            style={styles.modalView}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            enabled
                        >
                            <Pressable style={styles.modalContent} onPress={() => setShowMenu(false)}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        ref={classInputRef}
                                        style={styles.input}
                                        placeholder="Past Perfect Continuous"
                                        value={theme}
                                        onChangeText={setTheme}
                                        onPress={() => setShowMenu(false)}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.optionsContainer}>
                                        <RoomSelector />
                                        <DatePicker />
                                        <TimePiker />
                                    </View>
                                    <View>
                                        <TouchableOpacity style={styles.add} onPress={handleAddActivity}>
                                            <Ionicons name="arrow-up-sharp" size={25} color={'white'} />
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </Pressable>
                            {showMenu && (
                                <View
                                    style={styles.roomMenu}
                                >
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
                                                    setRoom(item.title)
                                                    setShowMenu(false)
                                                }}
                                                onLongPress={() => handleDeleteRoom(item.id)}
                                            >
                                                <Text>{item.title}</Text>
                                            </TouchableOpacity>
                                        )}
                                        ListFooterComponent={() => (
                                            <TouchableOpacity
                                                style={{
                                                    padding: 10,
                                                    backgroundColor: 'white',
                                                    alignItems: 'flex-start',
                                                }}
                                                onPress={() => {
                                                    setShowAddRoomModal(!showAddRoomModal);
                                                    setShowMenu(!showMenu);
                                                }}
                                            >
                                                <Text style={{ color: GlobalStyles.colors.blue, fontWeight: 'bold' }}>+ Add New</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Segundo Modal  */}
            <Modal transparent visible={showAddRoomModal} onRequestClose={() => setShowAddRoomModal(false)} animationType="fade">
                <TouchableWithoutFeedback onPress={() => {
                    setShowAddRoomModal(false)
                    setNewRoom('')
                }}>
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingHorizontal: 50 }}>
                        <View style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15 }}>
                            <View style={{ width: '99%', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18 }}>Add New Room</Text>
                                <TextInput
                                    ref={roomInputRef}
                                    style={styles.inputSecondModal}
                                    placeholder="Ex.: 113"
                                    value={newRoom}
                                    onChangeText={setNewRoom}
                                    autoFocus={true}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                    setShowAddRoomModal(false)
                                    setNewRoom('')
                                }}>
                                    <Text style={{ color: GlobalStyles.colors.blue, fontSize: 16, }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.optionButton, { borderRadius: 10, marginLeft: 15, marginRight: 5 }]} onPress={handlAddNewRoom}>
                                    <Text style={{ color: 'white', fontSize: 15 }}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: '#FFFFFFFF',
        width: '100%',
        padding: 10,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        justifyContent: 'center',
        minHeight: 125
    },
    modalContent: {
        flex: 1,
    },
    optionsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 5,
    },
    input: {
        marginHorizontal: 1,
        backgroundColor: '#F0F0F0FF',
        height: 55,
        fontSize: 15,
        borderRadius: 6,
        paddingStart: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: GlobalStyles.colors.secundary,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 15,
        marginRight: 10
    },
    add: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4FD15FFF',
        borderRadius: 25
    },
    roomMenu: {
        position: 'absolute',
        bottom: 46,
        left: 10,
        width: 180,
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 8,
        padding: 5,
        maxHeight: 165,
        flex: 1,
    },
    inputSecondModal: {
        width: '100%',
        fontSize: 16,
        borderRadius: 6,
        backgroundColor: '#F0F0F0FF',
        marginBottom: 15,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 10
    }
})
