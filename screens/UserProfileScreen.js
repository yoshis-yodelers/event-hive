import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { ListItem, Divider, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { Constands } from 'expo';
import { FirebaseWrapper } from '../firebase/firebase';

export default class UserProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      events: [],
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

  _getUserEvents = async () => {
    try {
      if (Object.keys(this.state.user) !== 0) {
        const userEvents = this.state.user.events.map(async event => {
          const eventData = await FirebaseWrapper.GetInstance().GetEvents(
            'Event',
            event
          );
          const eventUser = eventData.data();
          return eventUser;
        });

        const eventsForUser = await Promise.all(userEvents);

        this.setState({
          ...this.state,
          events: eventsForUser,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount = async () => {
    await this._getUserInfo();
    await this._getUserEvents();
  };

  render() {
    const { navigate } = this.props.navigation;
    const month = ["January", "February", "March", "April", "May", "June", "July", "August",
                  "September", "October", "November", "December"]
    return (
      <View style={styles.container}>
        <Text style={styles.name}>Hey, {this.state.user.first_name}!</Text>
        <Image
          source={{ uri: this.state.user.profile_picture }}
          style={styles.image}
        />
        <Text style = {{fontSize: 20, fontWeight: "bold", paddingBottom: 10, paddingTop: 20}}>Upcoming Events:</Text>
        <ScrollView style={styles.event}>
          {this.state.events.map(event => {
            const startDateArray = event.start.split("T").join().split(/[-:,]/).map(num => parseInt(num))
            startDateArray[3] > 11 ?
            startDateArray.push("PM")
            :startDateArray.push("AM")

            const endDateArray = event.end.split("T").join().split(/[-:,]/).map(num => parseInt(num))
            endDateArray[3] > 11 ?
            endDateArray.push("PM")
            :endDateArray.push("AM")

            const startTime = (startDateArray[3] >= 12 ? (startDateArray[3]=== 12 ? 12 : (startDateArray[3]-12))
            : startDateArray[3])+ ":" + (startDateArray[4]=== 0 ? '00' : startDateArray[4])+ startDateArray[6]

            const endTime = (endDateArray[3] >= 12 ? (endDateArray[3]=== 12 ? 12 : (endDateArray[3]-12))
            : endDateArray[3])+ ":" + (endDateArray[4]=== 0 ? '00' : endDateArray[4]) + endDateArray[6]

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
                      addButton: false,
                      startDate: startDate,
                      startTime: startTime,
                      endDate: endDate,
                      endTime: endTime,
                      venue: event.venue
                    })
                  }
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const { width } = Dimensions.get('window');
const imageHeight = width * 0.4;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 250
  },
  image: {
    height: imageHeight,
    width,
  },
  listItem: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  divider: {
    backgroundColor: 'grey',
    height: 4,
    flex: 1,
  },
  listItemParent: {
    borderStyle: 'solid',
    borderColor: 'grey',
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  textPadding: {
    paddingTop: 25,
    paddingBottom: 20,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
});
