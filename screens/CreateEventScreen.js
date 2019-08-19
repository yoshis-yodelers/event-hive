import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class CreateEventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Yodeler',
    };
  }

  async createEvent() {
    try {
      console.log('Hola ', this.state.name);
      await FirebaseWrapper.GetInstance().CreateNewDocument('Event', {
        name: this.state.name,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View
        // eslint-disable-next-line no-use-before-define
        style={styles.view}
      >
        <Text>This is the Create Event Page</Text>
        <TextInput
          // eslint-disable-next-line no-use-before-define
          style={styles.input}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
        <Button title="Create Event" onPress={() => this.createEvent()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: { marginTop: 85 },
  input: { height: 80, borderColor: 'gray', borderWidth: 1 },
});
