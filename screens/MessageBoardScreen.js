import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import * as firebase from 'firebase';
import { FirebaseWrapper } from '../firebase/firebase';
import NavigationService from '../navigation/NavigationService';

class MessageBoardScreen extends Component {
  static navigationOptions = {
    title: 'Message Another User',
    headerTitleStyle: {
      textAlign: 'center',
      flexGrow: 1,
      alignSelf: 'center',
      fontSize: 24,
    },
  };
  constructor(props) {
    super(props);
    this.state = {
      allContacts: [],
      // user: null,
    };
  }

  async componentDidMount() {
    const userInfo = await firebase.auth().currentUser;
    // this.setState({
    //   user: userInfo,
    // });
    this.setAllContacts(userInfo);
  }

  async setAllContacts(currentUser) {
    try {
      //User information fetched for key, profilePicture, firstName, lastName
      const allUsers = await FirebaseWrapper.GetInstance().GetAllUsers();
      this.setState({
        allContacts: allUsers,
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          NavigationService.navigate('MessageScreen', {
            item: item,
            // user: this.state.user,
          })
        }
      >
        <ListItem
          style={styles.listItem}
          leftAvatar={{ source: { uri: item.profilePicture } }}
          title={
            typeof item.lastName === 'string'
              ? `${item.firstName} ${item.lastName}`
              : `${item.firstName} `
          }
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <FlatList data={this.state.allContacts} renderItem={this.renderItem} />
    );
  }
}

const offset = 24;

const styles = StyleSheet.create({
  listItem: {
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export default MessageBoardScreen;
