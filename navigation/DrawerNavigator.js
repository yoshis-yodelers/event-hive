import React from 'react';
import MainTabNavigator from './MainTabNavigator';
import { Text, View, TouchableOpacity } from 'react-native';
import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import NavigationService from './NavigationService';
import UserProfileScreen from '../screens/UserProfileScreen';

export class SettingsScreen extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={() => NavigationService.toggleDrawer()}>
        <Icon name="menu" color="#fff" size={30} />
      </TouchableOpacity>
    );
  }
}

const DrawerNavigator = createDrawerNavigator(
  {
    Home: MainTabNavigator,
    Profile: UserProfileScreen,
    Settings: SettingsScreen,
  },
  {
    hideStatusBar: true,
    drawerBackgroundColor: 'rgba(255,255,255,.9)',
    overlayColor: '#6b52ae',
    contentOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: '#6b52ae',
    },
  }
);

export default createAppContainer(DrawerNavigator);
