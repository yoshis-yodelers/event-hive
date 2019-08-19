import React from 'react';
import eventBriteData from '../src/db/eventBriteData';
import eventBriteToken from '../secrets';

import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    marginBottom: 400,
    color: 'darkturquoise',
    fontSize: 70,
  },
});

export default class LoginScreen extends React.Component {
  async componentDidMount() {
    const events = await eventBriteData();
    console.log(
      events.data.events.map(event => {
        return event.name.text;
      })
    );
  }

  render() {
    console.log(eventBriteToken);
    return (
      <View>
        <Text>This is the login screen</Text>
      </View>
    );
  }
}

LoginScreen.navigationOptions = {
  header: null,
};
