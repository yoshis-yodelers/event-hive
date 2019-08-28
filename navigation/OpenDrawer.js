import { DrawerActions } from 'react-navigation-drawer';
import { TouchableOpacity } from 'react-native';

const MenuButton = props => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          console.warn(props);
          props.navigation.dispatch(DrawerActions.openDrawer());
        }}
      >
        <Text>Menu</Text>
      </TouchableOpacity>
    </View>
  );
};
