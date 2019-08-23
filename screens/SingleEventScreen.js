import React from "react";
import { ListItem, FlatList } from "react-native-elements";

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView
} from "react-native";
import { FirebaseWrapper } from "../firebase/firebase";
import * as firebase from "firebase";
import "firebase/firestore";
// import console = require('console');

export default class SingleEventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return <View />;
  }
}

SingleEventScreen.navigationOptions = {
  header: null
};
