import React from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView} from 'react-native';
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
// import console = require('console');

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    }
  }

  async componentDidMount(){
    try {
      //change reference to user once we get Oauth done
      const userInfo = await FirebaseWrapper.GetInstance().GetEvents('User', 'YNeFkzY2FL0XBeLRwOfw')
      const eventsArray = await userInfo.data().events
      const eventsInfo = await eventsArray.map(async function(event) {
        const eventCollection = await FirebaseWrapper.GetInstance().GetEvents('Event', event)
        return eventCollection.data()
      })
      const events = await Promise.all(eventsInfo)
      this.setState({events: events})
    } catch (error) {
        console.log(error);
      }
  }

  render() {
    let counter = 0
    console.log(this.state.events)
    return (
      <View>
        <Text>Today's Events</Text>
        <ScrollView>
        {this.state.events.length > 0 ? this.state.events.map(event => { return(
          <View key = {event.name}>
          <Text>{event.name}</Text>
          <Text> </Text>
          </View>)
        }): <Text>(no upcoming events)</Text> }
        </ScrollView>
      </View>
    );
  }
}
