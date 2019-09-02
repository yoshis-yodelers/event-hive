import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { FirebaseWrapper } from '../firebase/firebase';

class MessageScreen extends Component {
  static navigationOptions = {
    title: null,
  };

  state = {
    messages: [],
  };

  async componentWillMount() {
    const userInfo = await firebase.auth().currentUser;
    const contactInfo = this.props.navigation.state.params.item;
    const pastMessages = await FirebaseWrapper.GetInstance().GetPastMessages(
      contactInfo
    );

    this.setState({
      messages: [],
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    const contact = this.props.navigation.state;
    console.log('contact: Anna', contact.params.item);
    console.log('currentUser', contact.params.user);
    console.log('messages', this.state.messages);

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

export default MessageScreen;
