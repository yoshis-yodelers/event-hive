import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as firebase from "firebase";
import { firebaseConfig } from "../firebase/firebase";

export default class LoadingScreen extends Component {
  componentDidMount() {
    this.checkedIfLoggedIn();
  }
  checkedIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          this.props.navigation.navigate("HomeScreen");
        } else {
          this.props.navigation.navigate("LoginScreen");
        }
      }.bind(this)
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
