import React, { Component } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';

class MessageScreen extends Component {
  static navigationOptions = {
    title: null,
  };

  state = {
    messages: [],
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hey Beatriz, it's great to meet you!",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Beyonce',
            avatar:
              'https://scontent-iad3-1.xx.fbcdn.net/v/t1.0-9/22539886_1678745995490758_332520504145689866_n.jpg?_nc_cat=110&_nc_oc=AQn5DBUv7d4gp1aD9lcnbXb49b_iwR4AlciJbKT90X7SCbYifuht2BEHossJ6LtoQw20nbqmKZvDtEQOBHMUlcOY&_nc_ht=scontent-iad3-1.xx&oh=76272455b3797de442e0fa68310ac40b&oe=5E08103C',
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
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
