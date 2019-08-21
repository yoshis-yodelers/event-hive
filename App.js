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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 40.70454,
      longitude: -74.00947,
      errorMessage: null,
    };
  }

  async componentDidMount() {
    const app = this;
    await this._getLocationAsync(function(latitude, longitude) {
      const eventBrite = new EventBrite();
      if (app.state.latitude !== null) {
        eventBrite.SetEventBriteData(latitude, longitude);
        app
          .setState({
            latitude: latitude,
            longitude: longitude,
          })
          .catch(error => {
            console.error(`there was an error ${error}`);
          });
      } else {
        console.log(this.app.state.latitude);
      }
    });
  }

  _getLocationAsync = async callback => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    } else {
      let location = await Location.getCurrentPositionAsync({});
      callback(location.coords.latitude, location.coords.longitude);
    }
  };

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
