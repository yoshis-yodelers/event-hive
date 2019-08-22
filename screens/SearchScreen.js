import React from 'react';
import { View, Text } from 'react-native';
import { MainHeaderNavigator } from '../navigation/MainHeaderNavigator';

export default class SearchScreen extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <View>
        <MainHeaderNavigator text="Search" />
        <Text>Here is where a user searches for activities!</Text>
      </View>
    );
  }
}

SearchScreen.navigationOptions = {
  header: null,
};
