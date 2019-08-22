import React from 'react';
import { StyleSheet, View, Platform, StatusBar, Text } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
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
      latitude: 42.3601, // love that dirty water
      longitude: -71.0589, // boston you're my home
      errorMessage: null,
    };
  }

  componentDidMount() {
    this._checkUserLocation();
  }

  _checkUserLocation() {
    const userLocation = new UserLocation();

    // get a [latitude, longitude] array or set errorMessage in state
    const latLong = userLocation._getLocationAsync();
    if (typeof latLong === 'string') {
      this.setState({ errorMessage: latLong });
    } else {
      this._setLocation(latLong[0], latLong[1]);
    }
  }

  _setLocation(latitude, longitude) {
    if (this.state.latitude !== null) {
      const eventBrite = new EventBrite();
      eventBrite.SetEventBriteData(latitude, longitude);
      this.setState({ latitude: latitude, longitude: longitude });
      console.log(this.state);
    } else {
      console.log(this.state.latitude);
    }
  }

  render() {
    FirebaseWrapper.GetInstance().Initialize(firebaseConfig);
    return <AppNavigator />;
  }
}
