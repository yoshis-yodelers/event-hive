import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import firebase from "firebase";
export default class SignOutScreen extends React.Component {
  render() {
    return (
      <View>
        <Button title="Sign Out" onPress={() => firebase.auth().signOut()} />
      </View>
    );
  }
}
