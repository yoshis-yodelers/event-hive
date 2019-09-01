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
    this.interestFeedFn = this.interestFeedFn.bind(this)
    this.createFeeds = this.createFeeds.bind(this)
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
      //Firebase- Gets the userId of the current user
      const user = firebase.auth().currentUser;
      //Firebase- User information fetched from Firebase(including events & interests array)
      const userInfo = await FirebaseWrapper.GetInstance().GetEvents(
        'User',
        user.uid
      );
      //Formats information from Firebase from line above
      const eventsArray = await userInfo.data();
      //Sets local state to array of events (Upcoming events) from line above
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

      <View style={{paddingBottom: 270}}>
        <View>
          <Text style={styles.eventTitle}>
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
                  const startDateArray = event.start.split("T").join().split(/[-:,]/).map(num =>
                  parseInt(num))
                  startDateArray[3] > 11 ?
                  startDateArray.push("PM")
                  :startDateArray.push("AM")

                  const endDateArray = event.end.split("T").join().split(/[-:,]/).map(num => parseInt(num))
                  endDateArray[3] > 11 ?
                  endDateArray.push("PM")
                  :endDateArray.push("AM")

                  const startTime =(startDateArray[3] >= 12 ? (startDateArray[3]=== 12 ? 12 :(startDateArray[3]-12))
                  :startDateArray[3] === 0 ? 12 : startDateArray[3])+ ":" +(startDateArray[4]=== 0 ? '00' :startDateArray[4]) + startDateArray[6]

                  const endTime = (endDateArray[3] >= 12 ? (endDateArray[3]=== 12 ? 12 : (endDateArray[3]-12))
                  : endDateArray[3] === 0 ? 12 : endDateArray[3])+ ":" + (endDateArray[4]=== 0 ? '00' : endDateArray[4]) + endDateArray[6]

                  const startDate = month[startDateArray[1]-1]+ ' ' + startDateArray[2] + ', ' + startDateArray[0]

                  const endDate = month[endDateArray[1]-1]+ ' ' + endDateArray[2] + ', ' + endDateArray[0]

                  return (
                    <View key={event.id} style={styles.carousel}>
                      <TouchableOpacity onPress={() =>
                          navigate("SingleEventScreen", {
                            eventId: event.id,
                            imgUrl: event.imageUrl,
                            eventName: event.name,
                            description: event.description,
                            venueId: event.venue,
                            addButton: false,
                            startDate: startDate,
                            startTime: startTime,
                            endDate: endDate,
                            endTime: endTime
                          })
                        }>
                      <Image
                        source={{ uri: event.imageUrl ? event.imageUrl :''}}
                        style={{ height: imageHeight, width }}
                      />
                      <Text style={styles.eventName}>{event.name}</Text>
                      <Text style={styles.eventTime}>
                      {event.start ? startDate + ' ' + startTime + " - " +
                      (startDate === endDate ? endTime : endDate + ' ' + endTime)
                      : ''}</Text>
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
          <Text style={styles.eventTitle}>Event Feed</Text>
          <ScrollView style={styles.interested}>
            {this.state.feed.length > 0 ? (
              this.state.feed.map(event => {
                if (event.end > date && !this.state.eventIds.includes(event.id)) {

                  const startDateArray = event.start.split("T").join().split(/[-:,]/).map(num => parseInt(num))
                  startDateArray[3] > 11 ?
                  startDateArray.push("PM")
                  :startDateArray.push("AM")

                  const endDateArray = event.end.split("T").join().split(/[-:,]/).map(num => parseInt(num))
                  endDateArray[3] > 11 ?
                  endDateArray.push("PM")
                  :endDateArray.push("AM")

                  const startTime = (startDateArray[3] >= 12 ? (startDateArray[3]=== 12 ? 12 : (startDateArray[3]-12))
                  : startDateArray[3] === 0 ? 12 : startDateArray[3])+ ":" + (startDateArray[4]=== 0 ? '00' : startDateArray[4])+ startDateArray[6]

                  const endTime = (endDateArray[3] >= 12 ? (endDateArray[3]=== 12 ? 12 : (endDateArray[3]-12))
                  : endDateArray[3] === 0 ? 12 : endDateArray[3])+ ":" + (endDateArray[4]=== 0 ? '00' : endDateArray[4]) + endDateArray[6]

                  const startDate = month[startDateArray[1]-1]+ ' ' + startDateArray[2] + ', ' + startDateArray[0]

                  const endDate = month[endDateArray[1]-1]+ ' ' + endDateArray[2] + ', ' + endDateArray[0]

                  return (
                    <View key={event.id} style={styles.listItemParent}>
                      <Divider style={styles.divider} />
                      <ListItem
                        style={styles.listItem}
                        leftAvatar={{ source: { uri: event.imageUrl } }}
                        title={event.name}
                        subtitle={event.start ? startDate + ' ' + startTime + " - " +
                        (startDate === endDate ? endTime : endDate + ' ' + endTime)
                        :''}
                        onPress={() =>
                          navigate('SingleEventScreen', {
                            eventId: event.id,
                            imgUrl: event.imageUrl,
                            eventName: event.name,
                            description: event.description,
                            venueId: event.venue,
                            addButton: true,
                            startDate: startDate,
                            startTime: startTime,
                            endDate: endDate,
                            endTime: endTime,
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
    paddingHorizontal: 10,
    paddingTop: 5
  },

  eventTime: {
    paddingHorizontal: 10
  },

  eventTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10
  },

  interested: {
  }
});
