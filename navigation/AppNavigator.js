import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import LoginScreen from "../screens/LoginScreen";
// import HomeScreen from "../screens/HomeScreen";

const AuthStack = createStackNavigator({
  LoginRoute: LoginScreen
});

const AppStack = createStackNavigator({
  AppRoute: MainTabNavigator
});

export default createAppContainer(
  createSwitchNavigator({
    Auth: AuthStack,

    Home: AppStack
  })
);
