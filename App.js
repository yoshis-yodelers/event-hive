import React from 'react';
import { StyleSheet, View, Platform, StatusBar, Text } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { FirebaseWrapper } from './firebase/firebase';
import { firebaseConfig } from './firebase/config';

export default class App extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    FirebaseWrapper.GetInstance().Initialize(firebaseConfig);
    return <AppNavigator />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
