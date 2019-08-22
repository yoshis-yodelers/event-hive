import React from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';

const correctColumns = (data, numColumns) => {
  const numTotalFullRows = Math.floor(data.length / numColumns);
  let lastRowColumns = data.length - numTotalFullRows * numColumns;
  while (lastRowColumns !== numColumns && lastRowColumns !== 0) {
    data.push({ key: `blank-${lastRowColumns}`, empty: true });
    lastRowColumns++;
  }

  return data;
};

const data = [
  { key: 'Sports' },
  { key: 'Fashion' },
  { key: 'Outdoors' },
  { key: 'Nature' },
  { key: 'Trucking' },
  { key: 'Larping' },
  { key: 'Eating Pie' },
  { key: 'Sleeping' },
  { key: 'Getting Boba' },
  { key: 'Watching Cat Videos' },
  { key: 'Apple Picking' },
  { key: 'Drinking Water' },
];

// 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',

const numColumns = 3;
export default class ExploreScreen extends React.Component {
  renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={styles.item} />;
    }
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.key}</Text>
      </View>
    );
  };
  render() {
    return (
      <FlatList
        data={correctColumns(data, numColumns)}
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
