import React from "react";

import { StyleSheet, View, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  text: {
    marginBottom: 400,
    color: "darkturquoise",
    fontSize: 70
  }
});

export default class LoginScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>This is the login screen</Text>
      </View>
    );
  }
}
