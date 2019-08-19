import React from 'react';
import { StyleSheet, View, Platform, StatusBar, Text } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { FirebaseWrapper } from './firebase/firebase';
import { firebaseConfig } from './firebase/config';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import eventBriteToken from './secrets';
import * as firebase from 'firebase';
import axios from 'axios';

//import Geolocation from '@react-native-community/geolocation';

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
