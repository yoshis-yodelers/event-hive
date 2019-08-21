import React from 'react';
import { View, Text } from 'react-native';
import { HeaderNavigator } from '../navigation/HeaderNavigator';

export default class SearchScreen extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <View>
        <HeaderNavigator text="Search" />
        <Text>Here is where a user searches for activities!</Text>
      </View>
    );
  }
}

SearchScreen.navigationOptions = {
  header: null,
};
