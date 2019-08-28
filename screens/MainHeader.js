import React from 'react';
import { Header, Icon } from 'react-native-elements';
import { SettingsScreen } from '../navigation/DrawerNavigator';

export default class MainHeader extends React.Component {
  render() {
    return (
      <Header
        leftComponent={<SettingsScreen />}
        centerComponent={{
          text: 'EventHive',
          style: { color: '#fff', fontSize: 18 },
        }}
        rightComponent={<Icon name="notifications" color="#fff" size={30} />}
        containerStyle={{
          backgroundColor: '#32A7BE',
          justifyContent: 'space-around',
        }}
      />
    );
  }
}
