import React from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView } from 'react-native';
import { ListItem, Divider, Icon} from 'react-native-elements';
import { FirebaseWrapper } from '../firebase/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class SingleCategoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventFeed: [],
      favorite: '',
      user: {},
      category: ''
    };
    this.addInterest = this.addInterest.bind(this)
    this.removeInterest = this.removeInterest.bind(this)
  }

  // categoryData = async () => {
  //   try {
  //     //Get interest category information from firebase
  //     const interestCat = await FirebaseWrapper.GetInstance().GetEvents(
  //       'Categories',
  //       this.state.category
  //     );

  //     const categoryInfo = await interestCat.data();

  //     return categoryInfo;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  async interestFeedFn(interest) {
    try {
      const categoryCollection = await FirebaseWrapper.GetInstance().GetInterestEvents(
        interest
      );

      const events = categoryCollection.sort((event, event2) =>
      this.timeSort(event, event2));

      return events

    } catch (error) {
      console.log(error);
    }
  }

  async addInterest () {
    const userInfo = await FirebaseWrapper.GetInstance().addInterest(this.state.user.uid, this.state.category.key)
    this.setState({favorite: true})
  }

  async removeInterest() {
    const userInfo = await FirebaseWrapper.GetInstance().delInterest(this.state.user.uid, this.state.category.key)
    this.setState({favorite: false})
  }

  timeSort(event, event2) {
    if (event.start < event2.start) {
      return -1;
    }
    if (event.start > event2.start) {
      return 1;
    }
    return 0;
  }

  // Can we refactor this and homescreen, so we repeat less code?
  async componentDidMount() {
    try {
      // is there a better way?
      const categoryItem = this.props.navigation.state.params.item;
      const favoriteStatus = this.props.navigation.state.params.favorite;
      //Fetched from firebase, including upcoming events in an interest

      const user = firebase.auth().currentUser;

      const events = await this.interestFeedFn(categoryItem.key)

      // const categoryData = await this.categoryData();

      // //Map through the events and fetching event info from Events collection & formatting the data
      // const eventsInfo = await userInfoArray.events.map(async function(event) {
      //   const eventCollection = await FirebaseWrapper.GetInstance().GetEvents(
      //     'Event',
      //     event
      //   );
      //   return eventCollection.data();
      // });

      //Set the upcoming events state & interest feed state
      this.setState({ category: categoryItem, eventFeed: events, user: user, favorite: favoriteStatus});
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    //Get most recent date, and format it into date that can be compared with firebase dates
    const { navigate, goBack } = this.props.navigation;
    const newDate = new Date();
    const date = newDate.toISOString();
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    return (
      <View style = {{paddingBottom:40}}>
        <View style = {styles.buttontitle}>
          <TouchableOpacity onPress= {() => goBack()}>
            <Icon name="arrow-back" color={"grey"} size={25}/>
          </TouchableOpacity>
          <Text style={styles.title}>{this.state.category.type + " Feed"}</Text>
      {/* FAVORITE BUTTON (to add/remove an interest) */}
          {this.state.favorite ?
          <TouchableOpacity onPress= {() => this.removeInterest()}>
            <Icon name="favorite" color={"red"} size={25}/>
          </TouchableOpacity>
          :
          <TouchableOpacity onPress= {() => this.addInterest()}>
            <Icon name="favorite-border" color={"black"} size={25}/>
          </TouchableOpacity>}
        </View>
        <ScrollView>
          {this.state.eventFeed.length > 0 ? (
            this.state.eventFeed.map(event => {
              if (event.end > date) {

                const startDateArray = event.start.split("T").join().split(/[-:,]/).map(num => parseInt(num))
                  startDateArray[3] > 11 ?
                  startDateArray.push("PM")
                  :startDateArray.push("AM")

                const endDateArray = event.end.split("T").join().split(/[-:,]/).map(num => parseInt(num))
                endDateArray[3] > 11 ?
                endDateArray.push("PM")
                :endDateArray.push("AM")

                const startTime = (startDateArray[3] >= 12 ? (startDateArray[3]=== 12 ? 12 : (startDateArray[3]-12))
                  : startDateArray[3] === 0 ? 12 : startDateArray[3])+ ":" + (startDateArray[4]=== 0 ? '00' : startDateArray[4]) + startDateArray[6]

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
                      subtitle={event.start ? startDate + ' ' + startTime + " - " + (startDate === endDate ? endTime : endDate + ' ' + endTime): ''}
                      onPress={
                        () =>
                        navigate('SingleEventScreen', {
                          eventId: event.id,
                          imgUrl: event.imageUrl,
                          eventName: event.name,
                          description: event.description,
                          startDate: startDate,
                          startTime: startTime,
                          endDate: endDate,
                          endTime: endTime,
                          venue: event.venue,
                          attendees: event.attendees
                        })
                      }
                    />
                    <View />
                  </View>
                );
              }
            })
          ) : (
            <Text style = {{padding: 10}}>(no upcoming events)</Text>
          )}
        </ScrollView>
      </View>
    );
  }
}

const { width } = Dimensions.get('window');

SingleCategoryScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  image: {
    width,
    height: width * 0.3,
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
  eventName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttontitle: {
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20
  }
});

SingleCategoryScreen.navigationOptions = {
  header: null,
};
