import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import LoadingScreen from "../screens/LoadingScreen";
// import HomeScreen from "../screens/HomeScreen";

const AppSwitchNavigator = createStackNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: MainTabNavigator
});

const AppStack = createStackNavigator({
  AppRoute: MainTabNavigator
});

export default createAppContainer(createSwitchNavigator(AppSwitchNavigator));
