import React from 'react';
import {
  ListItem,
  FlatList,
  Divider,
  Header,
  Icon,
  ThemeProvider,
} from 'react-native-elements';

export default class MainHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    return (
      <Header
        leftComponent={<Icon name="menu" color="#fff" size={30} />}
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
