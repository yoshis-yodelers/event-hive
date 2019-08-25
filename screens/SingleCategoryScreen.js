import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
} from 'react-native';
import { FirebaseWrapper } from '../firebase/firebase';

export default class SingleCategoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventFeed: [],
    };
  }
  // Can we refactor this and homescreen, so we repeat less code?
  async componentDidMount() {
    try {
      const eventsInCategory = [];
      const categoryCode = this.props.navigation.state.params.id;

      console.log(this.props.navigation.state.params.id);
      const categoryCollection = await FirebaseWrapper.GetInstance().GetInterestEvents(
        categoryCode
      );
      console.log('hi petter', categoryCollection);

      //Push events found into an array after formatting the data.
      categoryCollection.forEach(async event => {
        eventsInCategory.push(await event.data());
      });

      //Consolidate all the interest event promises returned from above.
      const fevents = await Promise.all(eventsInCategory);
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
      //Set the upcoming events state & interest feed state
      this.setState({ eventFeed: ffevents });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    //Get most recent date, and format it into date that can be compared with firebase dates
    const newDate = new Date();
    const date = newDate.toISOString();
    return (
      // turn into flatlist - https://react-native-training.github.io/react-native-elements/docs/listitem.html
      <View style={{ paddingBottom: 300 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Event Feed</Text>
        <ScrollView>
          {this.state.feed.length > 0 ? (
            this.state.feed.map(event => {
              if (event.end > date) {
                return (
                  <View key={event.id} style={{ paddingBottom: 8 }}>
                    <Text>{event.name}</Text>
                    <Text>{event.start}</Text>
                  </View>
                );
              }
            })
          ) : (
            <Text>(no upcoming events)</Text>
          )}
        </ScrollView>
      </View>
    );
  }
}

SingleCategoryScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
});

SingleCategoryScreen.navigationOptions = {
  header: null,
};
