import React from "react";
import eventBriteData from "../src/db/eventBriteData";
import * as Google from "expo-google-app-auth";
import * as firebase from "firebase";

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button
} from "react-native";

// import eventBriteToken from '../secrets';

const fireBaseLogin = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      const token = result.credential.accessToken;
      const user = result.user;
    })
    .catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
    });
};

export default class LoginScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Sign In With Google"
          onPress={() => alert("button pressed")}
        />
      </View>
    );
  }
}

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
