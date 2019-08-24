import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

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
    };
  }

  async componentDidMount() {
    try {
      //User information fetched from firebase, including upcomign events & interests(change line 30 to user once OAuth done)
      const allCategories = await FirebaseWrapper.GetInstance().GetAllCategories();
      console.log(allCategories);
      this.setState({ allCategories: allCategories });
    } catch (error) {
      console.log(error);
    }
  }

  // makes FlatList's grid
  renderItem = ({ item, index }) => {
    // makes square invisible if empty (no key)
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.key}</Text>
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
  },
  item: {
    backgroundColor: '#32A7BE',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / numColumns, // creates a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});

ExploreScreen.navigationOptions = {
  header: null,
};
