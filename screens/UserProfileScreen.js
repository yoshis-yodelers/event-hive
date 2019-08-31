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
            return (
              <View key={event.id} style={styles.listItemParent}>
                <Divider style={styles.divider} />
                <ListItem
                  style={styles.listItem}
                  leftAvatar={{ source: { uri: event.imageUrl } }}
                  title={event.name}
                  subtitle={event.start}
                  onPress={() =>
                    navigate('SingleEventScreen', {
                      eventId: event.id,
                      imgUrl: event.imageUrl,
                      eventName: event.name,
                      description: event.description,
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
  container: {},
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
