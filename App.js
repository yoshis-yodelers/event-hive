import React from "react";
import { StyleSheet, View, Platform, StatusBar, Text } from "react-native";
import AppNavigator from "./navigation/AppNavigator";
import { FirebaseWrapper } from "./firebase/firebase";
import { firebaseConfig } from "./firebase/config";
import NavigationService from "./navigation/NavigationService";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import eventBriteToken from "./secrets";
import * as firebase from "firebase";
import axios from "axios";
import { EventBrite } from "./firebase/eventBriteData";
import { UserLocation } from "./firebase/userLocation";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 42.3601, // love that dirty water
      longitude: -71.0589, // boston you're my home
      errorMessage: null
    };
  }

  componentDidMount() {
    this._checkUserLocation();
  }

  async _checkUserLocation() {
    const userLocation = new UserLocation();

    // get a [latitude, longitude] array or set errorMessage in state
    try {
      const latLong = await userLocation._getLocationAsync();
      if (typeof latLong === "string") {
        this.setState({ errorMessage: latLong });
      } else {
        await this._setLocation(latLong[0], latLong[1]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async _setLocation(latitude, longitude) {
    if (this.state.latitude !== null) {
      const eventBrite = new EventBrite();
      eventBrite.SetEventBriteData(latitude, longitude);
      await eventBrite.SetLocationData();
      this.setState({ latitude: latitude, longitude: longitude });
    } else {
      console.log(this.state.latitude);
    }
  }

  render() {
    FirebaseWrapper.GetInstance().Initialize(firebaseConfig);
    return (
      <AppNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}
