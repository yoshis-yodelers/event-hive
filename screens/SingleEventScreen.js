import React from 'react';
import Geocode from 'react-geocode';
import googleMapsKey from '../secrets';
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  Button,
  ThemeProvider,
  Card,
  ListItem,
  FlatList,
  withTheme,
  Divider,
} from 'react-native-elements';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  Flatlist,
  Modal,
} from 'react-native';

const { width } = Dimensions.get('window');

const imageWidth = width;
const height = width * 0.6;

export default class SingleEventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      venueInfo: {},
      eventId: '',
      venuId: '',
      user: {},
      add: '',
      attendees: [],
      ashow: false,
    };
  }

  _getUserInfo = async () => {
    const user = firebase.auth().currentUser;
    const userInfo = async () => {
      const userData = await FirebaseWrapper.GetInstance().GetEvents(
        'User',
        user.uid
      );
      return userData;
    };
    const userData = await userInfo();
    this.setState({
      ...this.state,
      user: userData.data(),
    });
  };

  _addUserEvent = async () => {
    const { navigation } = this.props;
    const eventId = navigation.getParam('eventId', 'NO-ID');
    await FirebaseWrapper.GetInstance().AddUserEvent(
      this.state.eventId,
      this.state.user.uid
    );
    // await FirebaseWrapper.GetInstance().AddEventAttendee(
    //   eventId,
    //   this.state.user.uid
    // );
    this.setState({ add: false });
  };

  async addEvent() {
    const userInfo = await FirebaseWrapper.GetInstance().UserAddEvent(
      this.state.user.uid,
      this.state.eventId
    );
    const eventArray = await FirebaseWrapper.GetInstance().AddEventAttendee(
      this.state.eventId,
      this.state.user.uid
    );
    this.setState({ add: false });
  }

  async removeEvent() {
    await FirebaseWrapper.GetInstance().UserDelEvent(
      this.state.user.uid,
      this.state.eventId
    );

    await FirebaseWrapper.GetInstance().DelEventAttendee(
      this.state.eventId,
      this.state.user.uid
    );
    this.setState({ add: true });
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const eventId = navigation.getParam('eventId', 'NO-ID');
    const venueId = await navigation.getParam('venueId', 'Venue ID');
    const addButton = navigation.getParam('addButton', true);
    const user = firebase.auth().currentUser;
    const attendees = navigation.getParam('attendees', []);

    const eventCollection = await FirebaseWrapper.GetInstance().GetEvents(
      'Venue',
      venueId
    );

    const venue = await eventCollection.data();

    const attendeesPromise = attendees.map(async user => {
      try {
        const attendee = await FirebaseWrapper.GetInstance().GetEvents(
          'User',
          user
        );
        return attendee.data();
      } catch (error) {
        console.log(error);
      }
    });

    const attendeesList = await Promise.all(attendeesPromise);

    console.log(attendeesList);

    this.setState({
      eventId: eventId,
      venuId: venueId,
      user: user,
      add: addButton,
      venueInfo: venue,
      attendees: attendeesList,
    });
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;

    const eventId = navigation.getParam('eventId', 'NO-ID');
    const venueId = navigation.getParam('venueId', 'Venue ID');
    const eventDescription = navigation.getParam(
      'description',
      'Event Description'
    );
    const eventName = navigation.getParam('eventName', 'Event Description');
    const imgUrl = navigation.getParam('imgUrl', 'Event Image');
    const startDate = navigation.getParam('startDate', '');
    const startTime = navigation.getParam('startTime', '');
    const endTime = navigation.getParam('endTime', '');
    const endDate = navigation.getParam('endDate', '');

    return (
      <View style={styles.eventContainer}>
        <Text style={styles.eventName}>{eventName}</Text>
        <Text style={styles.eventDate}>
          {startDate +
            ' ' +
            startTime +
            ' - ' +
            (startDate === endDate ? endTime : endDate + ' ' + endTime)}
        </Text>
        <Text style={{ padding: 5 }}>
          {this.state.venueInfo
            ? this.state.venueInfo.address +
              ', ' +
              this.state.venueInfo.city +
              ', ' +
              this.state.venueInfo.state +
              ' ' +
              this.state.venueInfo.zipcode
            : ''}
        </Text>
        <ScrollView>
          <Text style={styles.eventDescription}>{eventDescription.trim()}</Text>
        </ScrollView>

        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: imgUrl,
            }}
          />
        </View>
        <Modal visible={this.state.ashow}>
          <View style={{ top: 40, paddingBottom: 300 }}>
            <Button
              title="Back"
              onPress={() => this.setState({ ashow: false })}
            />
            <Text style={styles.eventTitle}>Attendees: </Text>
            <ScrollView>
              {this.state.attendees.length > 0 ? (
                this.state.attendees.map(attendee => {
                  return (
                    <View key={attendee.email} style={styles.listItemParent}>
                      <Divider style={styles.divider} />
                      <ListItem
                        style={styles.listItem}
                        leftAvatar={{
                          source: { uri: attendee.profile_picture },
                        }}
                        title={attendee.first_name}
                        onPress={() =>
                          console.log(
                            'You want to message',
                            attendee.first_name
                          )
                        }
                      />
                      <View />
                    </View>
                  );
                })
              ) : (
                <Text style={{ paddingLeft: 10 }}>(No attendees)</Text>
              )}
            </ScrollView>
          </View>
        </Modal>
        {/* <View style={styles.buttonContainer}>
          <ThemeProvider theme={theme}>
            <Button
              title="Dashboard"
              onPress={() => navigate("MainTabNavigator")}
            />
          </ThemeProvider>
        </View>
        <View style={{ flex: 1, backgroundColor: "#f3f3f3" }}>
          {/* Rest of the app comes ABOVE the action button component !*/}
        <ActionButton buttonColor="#32A7BE">
          {this.state.add === true ? (
            <ActionButton.Item
              buttonColor="#1abc9c"
              title="Add Event"
              onPress={() => this._addUserEvent()}
            >
              <Icon name="md-add" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          ) : (
            <ActionButton.Item
              buttonColor="red"
              title="Remove Event"
              onPress={() => this.removeEvent()}
            >
              <Icon name="md-remove" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          )}
          <ActionButton.Item
            buttonColor="#3498db"
            title="I want to go with someone!"
            onPress={() => {
              this.setState({ ashow: true });
            }}
          >
            <Icon name="md-contacts" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Empty"
            onPress={() => {}}
          >
            <Icon name="md-done-all" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

const theme = {
  Button: {
    raised: true,
    color: 'white',
    buttonStyle: {
      height: 60,
    },
  },
};

const styles = StyleSheet.create({
  eventContainer: {
    paddingTop: 5,
    flex: 1,

    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  eventDetailsHeader: {
    fontSize: 18,
    paddingBottom: 5,
    paddingLeft: 4,
  },
  eventName: {
    paddingHorizontal: 5,
    paddingBottom: 5,
    marginBottom: 5,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#32A7BE',
  },
  eventDescription: {
    paddingRight: 4,
    paddingLeft: 4,
    marginTop: 5,
    backgroundColor: 'white',
    paddingBottom: 0,
    marginBottom: 0,
  },
  eventScrollView: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 50,
    marginTop: 0,
    marginBottom: 50,
  },
  imageContainer: {
    backgroundColor: 'white',
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    alignContent: 'center',
  },
  image: {
    width: imageWidth,
    height: height,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    alignContent: 'center',
  },
  addEventButtonContainer: {
    alignContent: 'center',
    paddingBottom: 2,
  },
  eventDate: {
    paddingHorizontal: 7,
    fontWeight: 'bold',
  },
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
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
  },
});
