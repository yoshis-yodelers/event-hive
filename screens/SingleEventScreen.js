import React from "react";
import Geocode from "react-geocode";
import googleMapsKey from "../secrets";
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

import {
  Button,
  ThemeProvider,
  Card,
  ListItem,
  FlatList,
  withTheme
} from "react-native-elements";

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  Flatlist
} from "react-native";
import "firebase/firestore";
// import * as firebase from "firebase";

const { width } = Dimensions.get("window");
const imageWidth = width;
const height = width * 0.6;

export default class SingleEventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      venueInfo: "",
      eventId: '',
      venuId: '',
      user: {},
      add: ''
    };
  }
  async componentDidMount() {
    const { navigation } = this.props;
    const eventId = navigation.getParam("eventId", "NO-ID");
    const venueId = navigation.getParam("venueId", "Venue ID");
    const addButton = navigation.getParam("addButton", true)
    const user = firebase.auth().currentUser;

    this.setState({eventId: eventId, venuId: venueId, user: user, add: addButton})
    // const eventCollection = await FirebaseWrapper.GetInstance().GetEvents(
    //   "Venue",
    //   venueId
    // );
    // const boop = await eventCollection.data();
    // this.setState({ venueInfo: await eventCollection.data() });
    // console.log("this is this.state.venueInfo", this.state.venueInfo);
    // console.log("this is the venue id", venueId);
    // console.log("eventCollection.data", await eventCollection.data());
    // console.log("event collection:", typeof (await eventCollection.data()));
    // eventCollection.map(e => console.log(e.data()));
  }

  async addEvent() {
    // const { navigation } = this.props;
    // const { navigate } = this.props.navigation;
    // const user = firebase.auth().currentUser;
    // const eventId = navigation.getParam("eventId", "NO-ID");
    // console.log(user, eventId)
    const userInfo = await FirebaseWrapper.GetInstance().UserAddEvent(this.state.user.uid, this.state.eventId)
    this.setState({add: false})
  }

  async removeEvent() {
    const userInfo = await FirebaseWrapper.GetInstance().UserDelEvent(this.state.user.uid, this.state.eventId)
    this.setState({add: true})
  }

  render() {
    // console.log(this.state.venueInfo);
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const eventId = navigation.getParam("eventId", "NO-ID");
    const imgUrl = navigation.getParam("imgUrl", "Event Image");
    // const lat = this.state.venueInfo.latitude;
    // const long = this.state.venueInfo.longitude;
    // console.log("this is the lat>>>>>>>>>>>>", lat);
    // console.log("this is the long>>>>>>>>>>>>", long);
    const eventDescription = navigation.getParam(
      "description",
      "Event Description"
    );
    const eventName = navigation.getParam("eventName", "Event Description");

    // Geocode.setApiKey(googleMapsKey);
    // Geocode.enableDebug();
    // Geocode.fromLatLng(lat, long).then(
    //   response => {
    //     const address = response.results[0].formatted_address;
    //     console.log("this is the address>>>>>>>", address);
    //   },
    //   error => {
    //     console.error(error);
    //   }
    // );

    return (
      <View style={styles.eventContainer}>
        {/* <Text style={styles.eventDetailsHeader}>Event Details</Text> */}
        <Text style={styles.eventName}>{eventName}</Text>
        {this.state.add === true ?
        <Button style = {{backgroundColor: "blue"}}title= "Add Event" onPress = {() => {this.addEvent()}}/>
        : <Button style = {{backgroundColor: "red"}}title= "Remove from List" onPress = {() => {this.removeEvent()}}/>}
        <ScrollView>
          <Text style={styles.eventDescription}>{eventDescription.trim()}</Text>
        </ScrollView>

        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: imgUrl
            }}
          />
        </View>
        {/* <View style={styles.buttonContainer}>
          <ThemeProvider theme={theme}>
            <Button
              title="Dashboard"
              onPress={() => navigate("MainTabNavigator")}
            />
          </ThemeProvider>
        </View> */}
      </View>
    );
  }
}

const theme = {
  Button: {
    raised: true,
    color: "white",
    buttonStyle: {
      // backgroundColor: "#32A7BE",
      height: 60,
    }
  }
};

const styles = StyleSheet.create({
  eventContainer: {
    paddingTop: 5,
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  eventDetailsHeader: {
    fontSize: 18,
    paddingBottom: 5,
    paddingLeft: 4
  },
  eventName: {
    paddingRight: 4,
    paddingLeft: 4,
    paddingBottom: 5,
    marginBottom: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "#32A7BE"
  },
  eventDescription: {
    paddingRight: 4,
    paddingLeft: 4,
    marginTop: 5,
    backgroundColor: "white",
    paddingBottom: 0,
    marginBottom: 0,
  },
  eventScrollView: {
    backgroundColor: "white",
    paddingTop: 0,
    paddingBottom: 50,
    marginTop: 0,
    marginBottom: 50
  },
  imageContainer: {
    backgroundColor: "white",
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    alignContent: "center"
  },
  image: {
    width: imageWidth,
    height: height,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    alignContent: "center"
  },
  buttonContainer: {
    alignContent: "center"
  }
});
