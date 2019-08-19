import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
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
      const boop = await FirebaseWrapper.GetInstance().GetEvents('User', 'YNeFkzY2FL0XBeLRwOfw').then(function(doc){return doc.data().events});
      this.setState({events: boop})
    } catch (error) {
        console.log(error);
      }
  }

  render() {
    return (
      <View>
        <Text>Today's Events</Text>
        {this.state.events.map(event => { return(
          <Text key={event}>{event}</Text>)
        })}
      </View>
    );
  }
}
