import React from "react";
import Expo from "expo";
import firebase from "firebase";
import * as Google from "expo-google-app-auth";
import { FirebaseWrapper } from "../firebase/firebase";

import { View, Text, StyleSheet, Button, Image } from "react-native";

export default class LoginScreen extends React.Component {
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      for (let i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    const unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          const credential = firebase.auth.GoogleAuthProvider.credential(
            // googleUser.getAuthResponse().id_token
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.

          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function(result) {
              console.log("user signed in");
              if (result.additionalUserInfo.isNewUser) {
                FirebaseWrapper.GetInstance().createUser("User", result);
              } else {
                console.log("user already logged in");
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              console.log("here's the error:", error);
              // ...
            });
        } else {
          console.log("User already signed-in Firebase.");
        }
      }.bind(this)
    );
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        behavior: "web",
        androidClientId:
          "1008246741429-2t3icr6oiusv8q64stil4m8rv0hfbdle.apps.googleusercontent.com",
        iosClientId:
          "1008246741429-trgs03tg4mdbnbv0f18e7gqonat0suip.apps.googleusercontent.com",

        scopes: ["profile", "email"]
      });
      if (result.type === "success") {
        // console.log(result);
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Image
            style={styles.logoImage}
            source={require("../assets/images/logo.png")}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Sign In With Google"
            onPress={() => {
              this.signInWithGoogleAsync();
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  logoImage: {
    justifyContent: "flex-end",
    alignSelf: "center",
    resizeMode: "stretch",
    marginTop: 250,
    width: 250,
    height: 250
  },
  buttonContainer: {
    marginTop: 100
  }
});
