import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native'

import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import StackRoutes from './src/screens/routes/stack.routes';
import Routes from './src/screens/routes';

LogBox.ignoreAllLogs()

export default function App() {
  return (
      <View style={styles.container} >
        <StatusBar style='light' />
        <Routes />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
