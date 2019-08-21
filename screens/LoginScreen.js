import React from 'react';
import eventBriteData from '../src/db/eventBriteData';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';
import Expo from 'expo';
// import { GoogleSignin } from "react-native-google-signin";

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import { ExportBundleInfo } from 'firebase-functions/lib/providers/analytics';

// const fireBaseLogin = () => {
//   const provider = new firebase.auth.GoogleAuthProvider();
//   firebase
//     .auth()
//     .signInWithPopup(provider)
//     .then(function(result) {
//       const token = result.credential.accessToken;
//       const user = result.user;
//     })
//     .catch(function(error) {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       const email = error.email;
//       const credential = error.credential;
//     });
// };

// const googleAuthenticate = (idToken, accessToken) => {
//   const credential = firebase.auth.GoogleAuthProvider.credential(
//     idToken,
//     accessToken
//   );
//   return firebase.auth().signInWithCredential(credential);
// };

// const googleAuthenticate = (idToken, accessToken) => {
//   const credential = firebase.auth.GoogleAuthProvider.credential(
//     idToken,
//     accessToken
//   );
//   return firebase.auth().signInWithCredential(credential);
// };

// const signIn = async () => {
//   const { idToken } = await GoogleSignin.signIn();
//   const provider = firebase.auth.GoogleAuthProvider;
//   const credential = provider.credential(idToken);

//   const data = await firebase.auth().signInWithCredential(credential);

//   const user = {
//     email: data.email,
//     name: data.displayName,
//     photoUrl: data.photoURL
//   };

//   return user;
// };

// const googleLogin = async () => {
//   try {
//     const result = await Expo.Google.logInAsync({
//       androidClientId: "Your Client ID",
//       iosClientId: "YOUR_CLIENT_ID_HERE",
//       scopes: ["profile", "email"]
//     });
//     if (result.type === "success") {
//       const credential = firebase.auth.GoogleAuthProvider.credential(
//         result.idToken,
//         result.accessToken
//       );
//       firebase
//         .auth()
//         .signInAndRetrieveDataWithCredential(credential)
//         .then(function(result) {
//           console.log(result);
//         });
//       this.props.navigation.navigate("HomeScreen");
//     } else {
//       console.log("cancelled");
//     }
//   } catch (e) {
//     console.log("error", e);
//   }
// };
// const logInWithGoogleAsync = async () => {
//   try {
//     if (result.type === "success") {
//       const credential = firebase.auth.GoogleAuthProvider.credential(
//         idToken,
//         accessToken
//       );
//       firebase.auth().signInWithCredential(credential);
//       this.props.navigation.navigate("HomeScreen");
//     } else {
//       console.log("cancelled");
//     }
//   } catch (e) {
//     console.log("error", e);
//   }
// };

export default class LoginScreen extends React.Component {
  signInWithGoogleAsync = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        behavior: 'web',
        androidClientId:
          '235168586795-h2ulbo5197h906djjd9hf0vqt8dd84al.apps.googleusercontent.com',
        iosClientId:
          '235168586795-l15n8flgih9mkcjsucous5j837mufpg9.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
      if (result.type === 'success') {
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
        <Button
          title="Sign In With Google"
          onPress={() => this.signInWithGoogleAsync()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    marginBottom: 400,
    color: 'darkturquoise',
    fontSize: 70,
  },
});
