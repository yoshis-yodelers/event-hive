import React from 'react';
import { ListItem, FlatList } from 'react-native-elements';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
} from 'react-native';
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
// import console = require('console');

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      feed: [],
    };
  }

  async componentDidMount() {
    try {
      //User information fetched from firebase, including upcomign events & interests(change line 30 to user once OAuth done)
      const userInfo = await FirebaseWrapper.GetInstance().GetEvents(
        'User',
        'YNeFkzY2FL0XBeLRwOfw'
      );
      //Formats the information from userInfo (events/interests/etc.)
      const eventsArray = await userInfo.data();
      //Map through the events array in User and fetching event info from Events collection & formatting the data
      const eventsInfo = await eventsArray.events.map(async function(event) {
        const eventCollection = await FirebaseWrapper.GetInstance().GetEvents(
          'Event',
          event
        );
        return eventCollection.data();
      });
      //Map through interest array, and find events in Events collection that match interest code. Returns an array of arrays (each array is for each interest code)
      const interestFeed = await eventsArray.interests.map(async function(
        interest
      ) {
        const interestArray = [];
        const interestCollection = await FirebaseWrapper.GetInstance().GetInterestEvents(
          interest
        );
        //Push events found into an array after formatting the data.
        interestCollection.forEach(async event => {
          interestArray.push(await event.data());
        });
        //Return array of events
        return interestArray;
      });

      //Consolidate all the interest event promises returned from above.
      const fevents = await Promise.all(interestFeed);
      //Flatten the array of events arrays into an array of event objects for all interests, and sort them based on the date & time.
      const ffevents = fevents.flat().sort(function(event, event2) {
        if (event.start < event2.start) {
          return -1;
        }
        if (event.start > event2.start) {
          return 1;
        }

        return 0;
      });
      //Consolidate all the upcomign event promises returned from above.
      const events = await Promise.all(eventsInfo);
      //Sort through array of event objects by start date/time
      const eventsSorted = events.sort(function(event, event2) {
        if (event.start < event2.start) {
          return -1;
        }
        if (event.start > event2.start) {
          return 1;
        }

        return 0;
      });
      //Set the upcoming events state & interest feed state
      this.setState({ events: eventsSorted, feed: ffevents });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    //Get most recent date, and format it into date that can be compared with firebase dates
    const newDate = new Date()
    const date = newDate.toISOString()
    return (
      // turn into flatlist - https://react-native-training.github.io/react-native-elements/docs/listitem.html
      <View style={{ padding: 10 }}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
            Today's Events
          </Text>
          <ScrollView>
            {this.state.events.length > 0 ? (
              this.state.events.map(event => {
                if (event.end > date) {
                  return (
                    // <View key={event.id} style={{ paddingBottom: 8 }}>
                    //   <Text>{event.name}</Text>
                    //   <Text>{event.start}</Text>
                    // </View>
                    <ListItem
                      key={event.id}
                      title={event.name}
                      subtitle={event.start}
                    />
                  );
                }
              })
            ) : (
              <Text>(no upcoming events)</Text>
            )}
          </ScrollView>
        </View>
        <View style={{ paddingBottom: 300 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Event Feed</Text>
          <ScrollView>
            {this.state.feed.length > 0 ? (
              this.state.feed.map(event => {
                if (event.end > date) {
                  return (
                    // <View key={event.id} style={{ paddingBottom: 8 }}>
                    //   <Text>{event.name}</Text>
                    //   <Text>{event.start}</Text>
                    // </View>
                    <ListItem
                      key={event.id}
                      title={event.name}
                      subtitle={event.start}
                    />
                  );
                }
              })
            ) : (
              <Text>(no upcoming events)</Text>
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};
