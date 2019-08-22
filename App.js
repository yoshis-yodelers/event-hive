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
import { EventBrite } from './firebase/eventBriteData';
import { UserLocation } from './firebase/userLocation';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 42.3601,
      longitude: 71.0589,
      errorMessage: null,
    };
  }

  async componentDidMount() {
    const userLocation = new UserLocation();
    const _setLocation = (latitude, longitude) => {
      try {
        if (this.state.latitude !== null) {
          const eventBrite = new EventBrite();
          eventBrite.SetEventBriteData(latitude, longitude);
          eventBrite.SetLocationData();
          this.setState({ latitude: latitude, longitude: longitude });
          console.log(this.state);
        } else {
          console.log(this.state.latitude);
        }
      } catch (error) {
        console.log(error);
      }
    };
    // get a [latitude, longitude] array
    const latLong = await userLocation._getLocationAsync();
    _setLocation(latLong[0], latLong[1]);
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
