import React from 'react';
import {Calendar} from 'react-native-calendars';
import { ScrollView, InputAccessoryView, DatePickerIOS, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class CreateEventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      start: new Date()
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
      <View>
      <View>
        <Text style = {{fontSize:20, fontWeight:"bold"}}>Create Event</Text>
      </View>
      <View style={styles.view}>
        <ScrollView>
        <Text>Event Name:</Text>
        <TextInput
          // eslint-disable-next-line no-use-before-define
          style={styles.input}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
        <Text>Description:</Text>
        <TextInput
          // eslint-disable-next-line no-use-before-define
          style={styles.input}
          onChangeText={name => this.setState({ description })}
          value={this.state.description}
        />
        <Button title = "Start Date" onPress = {() => this.props.navigation.navigate('MyModal')} />
        {/* <InputAccessoryView>
        <DatePickerIOS date = {this.state.start} onChange = {() => this.setState({start})}/>
        </InputAccessoryView> */}
        <Button title="Create Event" onPress={() => this.createEvent()} />
        </ScrollView>
      </View>
      </View>
    );
  }
}

class ModalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Dismiss"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: { marginTop: 85 },
  input: {height: 30, borderColor: 'gray', borderWidth: 1 },
});

CreateEventScreen.navigationOptions = {
  header: null,
};
