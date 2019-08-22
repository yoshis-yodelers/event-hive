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
      header: (
        <Header
          leftComponent={<Icon name="menu" color="#fff" size={30} />}
          centerComponent={{
            text: 'EventHive',
            style: { color: '#fff', fontSize: 18 },
          }}
          rightComponent={<Icon name="notifications" color="#fff" size={30} />}
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
