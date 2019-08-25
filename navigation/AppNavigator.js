import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { ThemeProvider, Header, Icon } from 'react-native-elements';

import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
  navigationOptions,
} from 'react-navigation';

import DrawerNavigator from './DrawerNavigator';
import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import MainHeader from '../navigation/MainHeader';
// import * as firebase from "firebase";
// import { firebaseConfig } from "../firebase/firebase";
// firebase.initializeApp(firebaseConfig);

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: {
    screen: DrawerNavigator,
    navigationOptions: MainHeader,
  },
});

const AppNavigator = createAppContainer(AppSwitchNavigator);
export default AppNavigator;
