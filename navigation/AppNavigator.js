import React from 'react';

import { createAppContainer, createStackNavigator } from 'react-navigation';
import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import SingleEventScreen from '../screens/SingleEventScreen';
import MainHeader from '../screens/MainHeader';
import UserProfileScreen from '../screens/UserProfileScreen';
// import * as firebase from "firebase";
// import { firebaseConfig } from "../firebase/firebase";
// firebase.initializeApp(firebaseConfig);

const AppSwitchNavigator = createStackNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: {
    screen: DrawerNavigator,
    navigationOptions: {
      title: 'Event Hive',
      header: <MainHeader />,
    },
  },
});

const AppNavigator = createAppContainer(AppSwitchNavigator);
export default AppNavigator;
