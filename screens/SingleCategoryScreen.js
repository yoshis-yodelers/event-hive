import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
} from 'react-native';
import { ListItem, FlatList, Divider } from 'react-native-elements';
import { FirebaseWrapper } from '../firebase/firebase';

export default class SingleCategoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventFeed: [],
    };
  }

  async interestFeedFn(interest) {
    try {
      const interestArray = [];
      // Get events base on interest
      const interestCollection = await FirebaseWrapper.GetInstance().GetInterestEvents(
        interest
      );
      //Push events found into an array after formatting the data.
      interestCollection.forEach(async event => {
        interestArray.push(await event.data());
      });
      //Return array of events
      return interestArray;
    } catch (error) {
      console.log(error);
    }
  }

  // Can we refactor this and homescreen, so we repeat less code?
  async componentDidMount() {
    try {
      // is there a better way?
      const categoryCode = this.props.navigation.state.params.key;

      console.log('categoryCode', categoryCode);
      //Fetched from firebase, including upcoming events in an interest
      const categoryCollection = await FirebaseWrapper.GetInstance().GetInterestEvents(
        categoryCode
      );

      console.log('hi', categoryCollection);
      // //Map through the events and fetching event info from Events collection & formatting the data
      // const eventsInfo = await userInfoArray.events.map(async function(event) {
      //   const eventCollection = await FirebaseWrapper.GetInstance().GetEvents(
      //     'Event',
      //     event
      //   );
      //   return eventCollection.data();
      // });

      //Set the upcoming events state & interest feed state
      this.setState({ eventFeed: categoryCollection });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    //Get most recent date, and format it into date that can be compared with firebase dates
    const newDate = new Date();
    const date = newDate.toISOString();

    console.log(this.state.eventFeed);
    return (
      <View style={{ padding: 10 }}>
        <View style={{ paddingBottom: 300 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Event Feed</Text>
          <ScrollView style={styles.interested}>
            {this.state.eventFeed.length > 0 ? (
              this.state.eventFeed.map(event => {
                if (event.end > date) {
                  return (
                    <View key={event.id} style={styles.listItemParent}>
                      <Divider style={styles.divider} />
                      <ListItem
                        style={styles.listItem}
                        key={event.id}
                        leftAvatar={{ source: { uri: event.imageUrl } }}
                        title={event.name}
                        subtitle={event.start}
                      />
                    </View>
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

SingleCategoryScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  listItem: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  listItemParent: {
    borderStyle: 'solid',
    borderColor: 'grey',
  },
  divider: {
    backgroundColor: 'grey',
    height: 3,
    flex: 1,
  },
  eventName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

SingleCategoryScreen.navigationOptions = {
  header: null,
};
