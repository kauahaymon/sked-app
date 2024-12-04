import { 
    createContext, 
    useEffect, 
    useState 
} from "react"

import AsyncStorage from "@react-native-async-storage/async-storage"

type PerformanceItem = {
    id: number
    text: string
};

type UpdateProps = {
    theme?: string; 
    room?: string; 
    date?: Date; 
    time?: Date; 
    description?: string;
    performance?: PerformanceItem[]
    considerations?: string
}

export const ActivityContext = createContext({})

export default function ActivityProvider({ children }: any) {
    const initialState: any = [
        {
            id: Math.random(),
            theme: "Edit This Class",
            room: "Sala",
            date: new Date(),
            time: new Date(),
            description: "",
            performance: [],
            considerations: ""
        }
    ]
    const [activity, setActivity] = useState(initialState)

    const [roomList, setRoomList] = useState([
        { id: Math.random(), title: 'Cimena' },
        { id: Math.random(), title: 'Smart Lab' },
        { id: Math.random(), title: 'Cooking' },
    ])
    const [newRoom, setNewRoom] = useState('')
    const [archivedActivities, setArchivedActivities]: any = useState([])

    // Create new class item
    function createActivity(
        { theme, room, date, time, }
            : {
                theme: string
                room: string
                date: Date
                time: Date
            }) {
        const newActivity = {
            id: Math.random(),
            theme,
            room,
            date,
            time,
            completed: false,
        }
        const updatedState = [...activity, newActivity]
        setActivity(updatedState)
        storeDataList(updatedState)
    }

    // Update class item by id and props
    function updateActivity(id: number, updates: UpdateProps) {
        setActivity((prevState: any) => {
            const updatedList = prevState.map((item: any) =>
                item.id === id ? { ...item, ...updates } : item
            )
    
            storeDataList(updatedList)
            return updatedList
        });
    }

    // Delete class item by id
    function deleteActivity(id: number) {
        const updatedState = activity.filter((activity: any) => activity.id !== id)
        setActivity(updatedState)
        storeDataList(updatedState)
    }

    function addNewRoom(newRoom: any) {
        const updatedRooms = [...roomList, newRoom]
        setRoomList(updatedRooms)
        storeRoomList(updatedRooms)
    }

    // Delete room by id
    function deleteRoom(roomId: number) {
        const updatedRooms = roomList.filter((room) => room.id !== roomId)
        setRoomList(updatedRooms)
        storeRoomList(updatedRooms)
    }

    function storeRoomList(roomList: any[]) {
        const jsonValue = JSON.stringify(roomList)
        AsyncStorage.setItem('roomList', jsonValue)
    }

    const getRoomList = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('roomList');
            if (jsonValue !== null) {
                const parsedRoomList = JSON.parse(jsonValue);
                setRoomList(parsedRoomList);
            }
        } catch (e) {
            console.error('Failed to load room list:', e);
        }
    };

    useEffect(() => {
        getRoomList()
    }, [])

    const moveToArchived = (id: number) => {
        const activityToArchive = activity.find((item: any) => item.id === id)
        if (!activityToArchive) return

        setActivity((prevState: any) => {
            const updatedState = prevState.filter((item: any) => item.id !== id)
            storeDataList(updatedState)
            return updatedState
        })

        setArchivedActivities((prevArchived: any) => {
            const updatedArchived = [...prevArchived, activityToArchive]
            storeArchivedActivities(updatedArchived)
            return updatedArchived
        })
    }

    const storeArchivedActivities = async (value: any) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem("archivedActivities", jsonValue)
        } catch (error) {
            console.error("Failed saving archived activities: ", error)
        }
    }

    const getArchivedActivities = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("archivedActivities")
            if (jsonValue !== null) {
                const parsedData = JSON.parse(jsonValue)
                setArchivedActivities(parsedData)
                return parsedData
            }
        } catch (error) {
            console.error("Error fetching archived activities: ", error)
        }
    }

    function toggleActivityCompletion(id: number) {
        setActivity((prevState: any) =>
            prevState.map((item: any) =>
                item.id === id ? { ...item, transitioning: true } : item
            )
        )

        setTimeout(() => {
            setActivity((prevState: any) => {
                const updatedState = prevState.map((item: any) =>
                    item.id === id
                        ? { ...item, completed: !item.completed, transitioning: false }
                        : item
                )
                storeDataList(updatedState)
                return updatedState
            })
        }, 100)
    }

    const getPendingCount = () => {
        return activity.filter((item: any) => !item.completed).length
    }

    const getCompletedCount = () => {
        return activity.filter((item: any) => item.completed).length
    }

    const getDescription = (id: number) => {
        const activityItem = activity.find((item: any) => item.id === id);
        return activityItem ? activityItem.description : null
    }

    const getConsiderations = (id: number) => {
        const activityItem = activity.find((item: any) => item.id === id);
        return activityItem ? activityItem.considerations : null
    }

    const getPerformance = (id: number) => {
        const activityItem = activity.find((item: any) => item.id === id)
        return activityItem ? activityItem.performance : null
    }

    const getArchivedCount = () => {
        return archivedActivities.length + getCompletedCount()
    }

    const storeDataList = async (value: any) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem("dataList", jsonValue)
        } catch (error) {
            console.error("Failed saving data: ", error)
        }
    }

    const getDataList = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("dataList")
            if (jsonValue !== null) {
                const parsedData = JSON.parse(jsonValue)
                setActivity(parsedData)
                return parsedData
            }
        } catch (error) {
            console.error("Error fetching activity data: ", error)
        }
    }

    useEffect(() => {
        getDataList()
    }, [])

    useEffect(() => {
        getArchivedActivities()
    }, [])

    return (
        <ActivityContext.Provider
            value={{
                createActivity,
                activity,
                toggleActivityCompletion,
                deleteActivity,
                getPendingCount,
                getCompletedCount,
                archivedActivities,
                moveToArchived,
                getArchivedCount,
                addNewRoom,
                roomList,
                deleteRoom,
                updateActivity,
                getDescription,
                getConsiderations,
                getPerformance
            }}
        >
            {children}
        </ActivityContext.Provider>
    )
}