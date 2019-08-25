import React from 'react';
import { View, Modal, Button, StyleSheet, Dimensions } from 'react-native';
import { Constants } from 'expo';
import { Text } from 'react-native-elements';
import { FirebaseWrapper } from '../firebase/firebase';
import * as firebase from 'firebase';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const buttonWidth = width * 0.3;
const colors = [
  '#00FFFF',
  '#00BFFF',
  '#6495ED',
  '#4682B4',
  '#00FF7F',
  '#00FA9A',
  '#7CFC00',
  '#1E90FF',
  '#7FFFD4',
];
let color = colors[Math.floor(Math.random() * colors.length - 1)];

export default class InterestModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCategories: [],
      modalVisible: true,
    };
  }

  async componentDidMount() {
    try {
      //set categories available to users into state
      const allCategories = await FirebaseWrapper.GetInstance().GetAllCategories();
      this.setState({ allCategories: allCategories });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View>
        <Modal visible={this.state.modalVisible}>
          <View styles={styles.viewContainer}>
            {this.state.allCategories &&
              this.state.allCategories.map(category => {
                return (
                  <View style={styles.buttonContainer} key={category.key}>
                    <TouchableOpacity
                      style={styles.touchableContainer}
                      key={category.key}
                    >
                      <Text style={styles.buttons}>{category.key}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}

            <Button title={'hello'} style={{ paddingTop: 50 }}>
              Hello
            </Button>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttons: {
    alignItems: 'center',
    width: buttonWidth,
    backgroundColor: color,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  touchableContainer: {
    flexDirection: 'row',
  },
});
