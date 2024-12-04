import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import GlobalStyles from "../../styles/GlobalStyles"
import ActivityProvider from "../../context/ActivityProvider"
import ActivityInfo from "../ActivityInfo"
import Home from "../Home"
import Splash from "../Splash"

const Stack = createNativeStackNavigator()

export default function StackRoutes() {
    return (
        <GestureHandlerRootView>
            <ActivityProvider>
                <Stack.Navigator initialRouteName="Splash"
                    screenOptions={{
                        headerShown: true,
                        headerTintColor: 'white',
                        title: 'Classes',
                        headerStyle: {
                            backgroundColor: GlobalStyles.colors.secundary
                        }
                    }}>
                    <Stack.Screen
                        options={{ headerShown: false}}
                        name="Splash"
                        component={Splash} />
                    <Stack.Screen
                        name="Home"
                        component={Home} />
                    <Stack.Screen
                        name="ActivityInfo"
                        component={ActivityInfo}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Navigator>
            </ActivityProvider>
        </GestureHandlerRootView>
    )
}