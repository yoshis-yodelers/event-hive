import React from 'react';
import {
  View,
  Modal,
  Button,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Constants } from 'expo';
import { Text } from 'react-native-elements';
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import NavigationService from '../navigation/NavigationService';

const { width } = Dimensions.get('window');
const buttonWidth = width * 0.3;
const colors = [
  '#00FFFF',
  '#00BFFF',
  '#6495ED',
  '#4682B4',
  '#00FF7F',
  '#00FA9A',
  '#7CFC00',
  '#1E90FF',
  '#7FFFD4',
];
let color = colors[Math.floor(Math.random() * colors.length - 1)];

const correctColumns = (data, numColumns) => {
  const numTotalFullRows = Math.floor(data.length / numColumns);
  let lastRowElements = data.length - numTotalFullRows * numColumns;
  while (lastRowElements !== numColumns && lastRowElements !== 0) {
    data.push({ key: `blank-${lastRowElements}`, empty: true });
    lastRowElements++;
  }

  return data;
};
const numColumns = 3;

export default class InterestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCategories: [],
      modalVisible: true,
      userInterests: [],
    };
  }

  // makes FlatList's grid
  renderItem = ({ item }) => {
    // makes square invisible if empty (no key)
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={styles.item}>
        <TouchableOpacity onPress={() => this.addInterest(item.key)}>
          <ImageBackground
            source={{
              uri: item.imageUrl,
            }}
            style={{
              height: Dimensions.get('window').width / numColumns - 4,
              width: Dimensions.get('window').width / numColumns - 4,
            }}
            imageStyle={{ borderRadius: 12 }}
          >
            <Text style={styles.itemText}>{item.type}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  async componentDidMount() {
    try {
      //set categories available to users into state
      const user = firebase.auth().currentUser;
      const userInfo = async () => {
        const userData = await FirebaseWrapper.GetInstance().GetEvents(
          'User',
          user.uid
        );
        return userData.data();
      };
      const userData = await userInfo();

      if (userData && userData.interests !== undefined) {
        this.setState({ modalVisible: false });
      }
      const allCategories = await FirebaseWrapper.GetInstance().GetAllCategories();
      this.setState({ allCategories: allCategories });
    } catch (error) {
      console.log(error);
    }
  }

  addInterestToUser = async () => {
    const user = firebase.auth().currentUser;
    if (this.state.userInterests.length !== 0) {
      await FirebaseWrapper.GetInstance().AddUserInterest(
        user.uid,
        this.state.userInterests
      );
      console.log(this.state.userInterests);
    }
    this.props.dismissModal();
  };

  addInterest = key => {
    this.state.userInterests.push(key);
    console.log(key);
  };

  render() {
    console.log(this.state.allCategories);
    return (
      <View>
        <Modal visible={this.props.modalVisible}>
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            style={styles.scrollContainer}
          >
            <FlatList
              data={correctColumns(this.state.allCategories, numColumns)}
              style={styles.container}
              renderItem={this.renderItem}
              numColumns={numColumns}
            />
            <Button
              title="Submit Interests"
              style={styles.submitButton}
              onPress={this.addInterestToUser}
            />
          </ScrollView>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttons: {
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  touchableContainer: {
    flex: 1,
    margin: 2,
    width: Dimensions.get('window').width / 2 - 6,
    height: 200,
    backgroundColor: color,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  submitButton: {
    paddingBottom: 50,
    paddingTop: 50,
    marginBottom: 50,
  },
  item: {
    position: 'relative',
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
    color: 'black',
    backgroundColor: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
