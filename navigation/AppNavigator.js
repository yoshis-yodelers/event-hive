import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import LoginScreen from "../screens/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
// import HomeScreen from "../screens/HomeScreen";
// import * as firebase from "firebase";
// import { firebaseConfig } from "../firebase/firebase";
// firebase.initializeApp(firebaseConfig);

const AppSwitchNavigator = createStackNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: MainTabNavigator
});

// const AppStack = createStackNavigator({
//   AppRoute: MainTabNavigator
// });

const AppNavigator = createAppContainer(AppSwitchNavigator);
export default AppNavigator;
