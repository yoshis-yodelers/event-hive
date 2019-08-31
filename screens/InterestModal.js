import React from 'react';
import { View, Modal, Button, StyleSheet, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { Text } from 'react-native-elements';
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import {
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} from 'react-native-gesture-handler';

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

export default class InterestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCategories: [],
      modalVisible: true,
      userInterests: [],
      opacity: 1
    };
  }

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

  addInterest = key => {
    this.state.userInterests.push(key);
    console.log(key);
  };

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

  render() {
    return (
      <View>
        <Modal visible={this.props.modalVisible}>
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            style={styles.scrollContainer}
          >
            <View styles={styles.viewContainer}>
              {this.state.allCategories &&
                this.state.allCategories.map(category => {
                  return (
                    // <View style={styles.buttonContainer} key={category.id}>

                    <TouchableOpacity
                      style={styles.touchableContainer}
                      key={category.key}
                      onPress={() => this.addInterest(category.key)}
                    >
                      {/* <TouchableHighlight> */}
                      <Text style={styles.buttons}>{category.type}</Text>
                      {/* </TouchableHighlight> */}
                    </TouchableOpacity>
                  );
                })}

              <Button
                title={'Submit Interests'}
                style={styles.submitButton}
                onPress={this.addInterestToUser}
              />
            </View>
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
});
