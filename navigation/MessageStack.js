import { createStackNavigator } from 'react-navigation';
import MessageBoardScreen from '../screens/MessageBoardScreen';
import MessageScreen from '../screens/MessageScreen';

const messageStack = createStackNavigator({
  MessageBoardScreen: MessageBoardScreen,
  MessageScreen: MessageScreen,
});

export default messageStack;
