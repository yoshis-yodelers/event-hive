import React from 'react';
import {
  ListItem,
  FlatList,
  Divider,
  Header,
  Icon,
  ThemeProvider,
} from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,

  Dimensions
} from "react-native";
import { Constants } from "expo";
import { FirebaseWrapper } from "../firebase/firebase";
import * as firebase from "firebase";
import "firebase/firestore";
import InterestModal from "./InterestModal";
import { fetchUpdateAsync } from "expo/build/Updates/Updates";
import NavigationService from "../navigation/NavigationService";
import { TouchableOpacity } from "react-native-gesture-handler";


const { width } = Dimensions.get('window');
const imageHeight = width * 0.3;
const height = width * 0.5;
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventIds: [],
      events: [],
      feed: [],
      user: {},
      modalVisible: false,
    };
  }

  async componentDidMount() {
    await this.createFeeds();
    if (this.state.user && this.state.user.interests === undefined) {
      this.setState({ modalVisible: true });
    }
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
        interestArray.push(await event);
      });
      //Return array of events
      return interestArray;
    } catch (error) {
      console.log(error);
    }
  }

  async createFeeds() {
    try {
      const user = firebase.auth().currentUser;
      //User information fetched from firebase, including upcomign events & interests(change line 31 to user once OAuth done)
      const userInfo = await FirebaseWrapper.GetInstance().GetEvents(
        'User',
        user.uid
      );
      //Formats the information from userInfo (events/interests/etc.)
      const eventsArray = await userInfo.data();
      //Map through the events array in User and fetching event info from Events collection & formatting the data
      this.setState({eventIds: eventsArray.events})

      const eventsInfo = await eventsArray.events.map(async function(event) {
        try {
          const eventCollection = await FirebaseWrapper.GetInstance().GetEvents(
            "Event",
            event
          );
          return eventCollection.data();
          } catch (error) {
            console.log(error)
          }
      });
      //Map through interest array, and find events in Events collection that match interest code. Returns an array of arrays (each array is for each interest code)
      const interestFeed = await eventsArray.interests.map(this.interestFeedFn);
      //Consolidate all the interest event promises returned from above.
      const fevents = await Promise.all(interestFeed);
      //Flatten the array of events arrays into an array of event objects for all interests, and sort them based on the date & time.
      const ffevents = fevents
        .flat()
        .sort((event, event2) => this.timeSort(event, event2));
      //Consolidate all the upcoming event promises returned from above.
      const events = await Promise.all(eventsInfo);
      //Sort through array of event objects by start date/time
      const eventsSorted = events.sort((event, event2) =>
        this.timeSort(event, event2)
      );
      //Set the upcoming events state & interest feed state
      this.setState({
        events: eventsSorted,
        feed: ffevents,
        user: userInfo.data(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  dismissModal = async () => {
    this.setState({ modalVisible: false });
    await this.createFeeds();
  };

  timeSort(event, event2) {
    if (event.start < event2.start) {
      return -1;
    }
    if (event.start > event2.start) {
      return 1;
    }
    return 0;
  }

  render() {
    const { navigate } = this.props.navigation;
    //Get most recent date, and format it into date that can be compared with firebase dates
    const newDate = new Date();
    const date = newDate.toISOString();
    const month = ["January", "February", "March", "April", "May", "June", "July", "August",
                  "September", "October", "November", "December"]

    return (
      // turn into flatlist - https://react-native-training.github.io/react-native-elements/docs/listitem.html

      <View style={{ padding: 10, paddingBottom: 170}}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
            Today's Events
          </Text>
          <ScrollView
            style={styles.subscribed}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {this.state.events.length > 0 ? (
              this.state.events.map(event => {
                if (event.end > date) {
                  const rawDateArray = event.start.split("T").join().split(/[-:,]/).map(num =>
                    parseInt(num))
                  rawDateArray[3] > 11 ?
                  rawDateArray.push("PM")
                  :rawDateArray.push("AM")
                  return (
                    <View key={event.id} style={styles.carousel}>
                      <TouchableOpacity onPress={() =>
                          navigate("SingleEventScreen", {
                            eventId: event.id,
                            imgUrl: event.imageUrl,
                            eventName: event.name,
                            description: event.description,
                            venueId: event.venue,
                            addButton: false
                          })
                        }>
                      <Image
                        source={{ uri: event.imageUrl.length > 2 ? event.imageUrl : 'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiMpZfNmKvkAhUMmeAKHYFNCpcQjRx6BAgBEAQ&url=https%3A%2F%2Ffreedomguidedogs.org%2Fspecial-event-icon%2F&psig=AOvVaw1ioYyEHgl-2j6TCmbhMXyX&ust=1567274938644487' }}
                        style={{ height: imageHeight, width }}
                      />
                      <Text style={styles.eventName}>{event.name}</Text>
                      <Text style={styles.eventTime}>
                      {event.start ? month[rawDateArray[1]]+ ' ' + rawDateArray[2] + ', ' + rawDateArray[0] + ' '
                        + (rawDateArray[3] >= 12 ? (rawDateArray[3]=== 12 ? 12 : (rawDateArray[3]-12))
                        : rawDateArray[3])+ ":" + (rawDateArray[4]=== 0 ? '00' : rawDateArray[4]) + rawDateArray[6]:''}</Text>
                      </TouchableOpacity>
                    </View>
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
          <ScrollView style={styles.interested}>
            {this.state.feed.length > 0 ? (
              this.state.feed.map(event => {
                if (event.end > date && !this.state.eventIds.includes(event.id)) {
                  const rawDateArray = event.start.split("T").join().split(/[-:,]/).map(num => parseInt(num))
                  rawDateArray[3] > 12 ?
                  rawDateArray.push("PM")
                  :rawDateArray.push("AM")
                  return (
                    <View key={event.id} style={styles.listItemParent}>
                      <Divider style={styles.divider} />
                      <ListItem
                        style={styles.listItem}
                        leftAvatar={{ source: { uri: event.imageUrl } }}
                        title={event.name}
                        subtitle={event.start ? month[rawDateArray[1]]+ ' ' + rawDateArray[2] + ', ' + rawDateArray[0] + ' '
                        + (rawDateArray[3] >= 12 ? (rawDateArray[3]=== 12 ? 12 : (rawDateArray[3]-12))
                        : rawDateArray[3])+ ":" + (rawDateArray[4]=== 0 ? '00' : rawDateArray[4]) + rawDateArray[6]:''}
                        onPress={() =>
                          navigate('SingleEventScreen', {
                            eventId: event.id,
                            imgUrl: event.imageUrl,
                            eventName: event.name,
                            description: event.description,
                            venueId: event.venue,
                            addButton: true
                          })
                        }
                      />
                      <View />
                    </View>
                  );
                }
              })
            ) : (
              <Text>(no upcoming events)</Text>
            )}
          </ScrollView>
          <InterestModal
            modalVisible={this.state.modalVisible}
            dismissModal={this.dismissModal}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  listItemParent: {
    borderStyle: 'solid',
    borderColor: 'grey',
  },
  // fix this
  divder: {
    backgroundColor: 'grey',
    height: 2,
    flex: 1,
  },
  subscribed: {
    height,
    width,
  },
  carousel: {
    height,
    width,
  },
  eventName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
