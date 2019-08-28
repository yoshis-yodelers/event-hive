import { createAppContainer, createStackNavigator } from 'react-navigation';
import ExploreScreen from '../screens/ExploreScreen';
import SingleCategoryScreen from '../screens/SingleCategoryScreen';

const initialPage = {
  initalRoot: 'Explore',
};

const ExploreNavigator = createStackNavigator(
  {
    Explore: { screen: ExploreScreen },
    SingleCategory: { screen: SingleCategoryScreen },
  },
  initialPage
);

export default createAppContainer(ExploreNavigator);
