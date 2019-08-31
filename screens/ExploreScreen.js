import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { FirebaseWrapper } from '../firebase/firebase';
import NavigationService from '../navigation/NavigationService';
import * as firebase from 'firebase';
import 'firebase/firestore';
// import {  } from 'react-native-gesture-handler';

const correctColumns = (data, numColumns) => {
  const numTotalFullRows = Math.floor(data.length / numColumns);
  let lastRowElements = data.length - numTotalFullRows * numColumns;
  while (lastRowElements !== numColumns && lastRowElements !== 0) {
    data.push({ key: `blank-${lastRowElements}`, empty: true });
    lastRowElements++;
  }

  return data;
};

// 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
const numColumns = 3;

export default class ExploreScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCategories: [],
      interests: []
    };
  }

  async componentDidMount() {
    try {
      //User information fetched from firebase, including upcomign events & interests(change line 30 to user once OAuth done)
      const user = firebase.auth().currentUser;
      const allCategories = await FirebaseWrapper.GetInstance().GetAllCategories();
      const interest = await FirebaseWrapper.GetInstance().GetEvents(
        "User",
        user.uid
      );
      const interests = interest.data()
      this.setState({ allCategories: allCategories, interests: interests.interests});
    } catch (error) {
      console.log(error);
    }
  }

  // makes FlatList's grid
  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;
    // makes square invisible if empty (no key)
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => NavigationService.navigate("SingleCategory", {item: item, favorite: this.state.interests.includes(item.key.toString())})}
        >
          <ImageBackground
            source={{
              uri: item.imageUrl,
            }}
            style={{
              height: Dimensions.get('window').width / numColumns - 4,
              width: Dimensions.get('window').width / numColumns - 4,

            }}
            imageStyle={{ borderRadius: 12}}
          >
            <Text style={styles.itemText}>{item.type}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      // search bar ref- https://www.freecodecamp.org/news/how-to-build-a-react-native-flatlist-with-realtime-searching-ability-81ad100f6699/

      <FlatList
        data={correctColumns(this.state.allCategories, numColumns)}
        style={styles.container}
        renderItem={this.renderItem}
        numColumns={numColumns}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    bottom: 10,
  },
  item: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,

    // backgroundColor: "blue",
    height: Dimensions.get('window').width / numColumns, // creates a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    padding: 5,
    textShadowColor: 'black',
    textShadowRadius: 5,
  },
  image: {},
});

ExploreScreen.navigationOptions = {
  header: null,
};
