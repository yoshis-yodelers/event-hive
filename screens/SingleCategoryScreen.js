import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
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

  categoryData = async () => {
    try {
      //Get interest category information from firebase
      const interestCat = await FirebaseWrapper.GetInstance().GetEvents(
        'Categories',
        interest
      );

      const categoryInfo = await interestCat.data();

      return categoryInfo;
    } catch (error) {
      console.log(error);
    }
  };

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

  async addInterest () {
    const userInfo = await FirebaseWrapper.GetInstance().addInterest(this.state.user.uid, this.state.category.key)
    this.setState({favorite: true})
  }

  async removeInterest() {
    const userInfo = await FirebaseWrapper.GetInstance().delInterest(this.state.user.uid, this.state.category.key)
    this.setState({favorite: false})
  }

  // Can we refactor this and homescreen, so we repeat less code?
  async componentDidMount() {
    try {
      // is there a better way?
      const categoryItem = this.props.navigation.state.params.item;
      const favoriteStatus = this.props.navigation.state.params.favorite;
      //Fetched from firebase, including upcoming events in an interest
      const categoryCollection = await FirebaseWrapper.GetInstance().GetInterestEvents(
        categoryItem.key
      );
      const user = firebase.auth().currentUser;

      const categoryData = await this.categoryData();

      // //Map through the events and fetching event info from Events collection & formatting the data
      // const eventsInfo = await userInfoArray.events.map(async function(event) {
      //   const eventCollection = await FirebaseWrapper.GetInstance().GetEvents(
      //     'Event',
      //     event
      //   );
      //   return eventCollection.data();
      // });

      //Set the upcoming events state & interest feed state
      this.setState({ category: categoryItem, eventFeed: categoryCollection, user: user, favorite: favoriteStatus});
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    //Get most recent date, and format it into date that can be compared with firebase dates
    const { navigate } = this.props.navigation;
    const newDate = new Date();
    const date = newDate.toISOString();

    return (
      <View style = {{paddingBottom:40}}>
        <View style = {{justifyContent: "space-between", flexDirection: "row", padding: 10}}>
        <Text style={{ fontWeight: 'bold', fontSize: 20}}>{this.state.category.type + " Feed"}</Text>
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
                return (
                  <View key={event.id} style={styles.listItemParent}>
                    <Divider style={styles.divider} />
                    <ListItem
                      style={styles.listItem}
                      leftAvatar={{ source: { uri: event.imageUrl } }}
                      title={event.name}
                      subtitle={event.start}
                      onPress={
                        () =>
                        navigate('SingleEventScreen', {
                          eventId: event.id,
                          imgUrl: event.imageUrl,
                          eventName: event.name,
                          description: event.description,
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
  }
});

SingleCategoryScreen.navigationOptions = {
  header: null,
};
