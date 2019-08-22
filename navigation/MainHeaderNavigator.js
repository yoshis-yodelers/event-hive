import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, Header } from 'react-native-elements';

export class MainHeaderNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ThemeProvider>
        <Header
          placement="center"
          rightComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{
            text: 'EventHive',
            style: { color: '#fff' },
            placement: 'center',
          }}
        />
      </ThemeProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});
