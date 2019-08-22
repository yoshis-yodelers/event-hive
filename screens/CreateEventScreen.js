import React from 'react';
import { KeyboardAvoidingView, Picker, ScrollView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { Calendar} from 'react-native-calendars'
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class CreateEventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      description: '',
      end: '',
      name: '',
      show: false,
      start: '',
      venue: '',
    };
    this.showCalendar.bind(this.showCalendar)
  }

  async createEvent() {
    try {
      console.log('Hola ', this.state.name);
      await FirebaseWrapper.GetInstance().CreateNewDocument('Event', {
        name: this.state.name,
        description: this.state.description
      });
    } catch (error) {
      console.log(error);
    }
  }

  showCalendar(type, input = '') {
    if (type === "start"){
      this.setState({show: !this.state.show, start: input})
    } else {
      this.setState({show: !this.state.show, end: input})
    }
  }

  render() {
    return (
      <View>
      <View>
        <Text style = {{fontWeight: "bold", fontSize: 20}}>Create New Event</Text>
      </View>
      <KeyboardAvoidingView>
      <ScrollView>
      <View style={styles.view}>
        <Text>Event Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
        <Text>Event Description:</Text>
        <TextInput
          style={styles.input}
          onChangeText={name => this.setState({ description })}
          value={this.state.description}
        />
        <Text>Start Date:</Text>
        {this.state.show && this.state.start.length <= 2 ?
        <Calendar current = {new Date().toISOString()} minDate = {new Date().toISOString()} onDayPress={(day) => {this.showCalendar("start",day.dateString)}}
         />
        :<TextInput style = {styles.input} value = {this.state.start} onFocus = {() => this.showCalendar("start")}/>}
        <Text>End Date:</Text>
        {this.state.show && this.state.start.length > 2 ?
        <Calendar current = {this.state.start} minDate = {this.state.start} onDayPress={(day) => {this.showCalendar("end", day.dateString)}}
         />
        :<TextInput style = {styles.input} value = {this.state.end} onFocus = {() => this.showCalendar()}/>}
        </View>
        <Button title="Create Event" onPress={() => this.createEvent()} />
        </ScrollView>
        </KeyboardAvoidingView>
        {/* <Picker>
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: { marginTop: 15 },
  input: { height: 30, borderColor: 'gray', borderWidth: 1},
});

CreateEventScreen.navigationOptions = {
  header: null,
};
