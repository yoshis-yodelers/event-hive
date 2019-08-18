import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CreateEventScreen from '../screens/CreateEventScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
};

const SearchStack = createStackNavigator({
  Search: SearchScreen,
});

SearchStack.navigationOptions = {
  tabBarLabel: 'Search',
};

const CreateEventStack = createStackNavigator({
  CreateEvent: CreateEventScreen,
});

CreateEventStack.navigationOptions = {
  tabBarLabel: 'Create',
};

export default createBottomTabNavigator({
  HomeStack,
  SearchStack,
  CreateEventStack,
});
