import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { ThemeProvider, Header, Icon } from 'react-native-elements';

import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
import HomeScreen from "../screens/HomeScreen";

// import * as firebase from "firebase";
// import { firebaseConfig } from "../firebase/firebase";
// firebase.initializeApp(firebaseConfig);

const AppSwitchNavigator = createStackNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: {
    screen: MainTabNavigator,
    navigationOptions: {
      title: 'Event Hive',
      header: (
        <Header
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{
            text: 'EventHive',
            style: { color: '#fff', fontSize: 18 },
          }}
          rightComponent={{ icon: 'home', color: '#fff' }}
          containerStyle={{
            backgroundColor: '#32A7BE',
            justifyContent: 'space-around',
          }}
        />
      ),
    },
  },
});

const AppNavigator = createAppContainer(AppSwitchNavigator);
export default AppNavigator;
