import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {booksUrl} from './api/Service';

const Tag = 'WS'

export default class ViewAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {connected: false};
    window.navigator.userAgent = 'react-native';
  }

  _connectSocket = () => {
    this.ws = new WebSocket('ws://' + booksUrl);
    this.ws.onerror = (e) => {
      console.log(Tag, 'Error', e.message);
    };

    this.ws.onopen = (ws, event) => {
      console.log(Tag, 'Socket open');
    };

    this.ws.onclose = () => {
      console.log(Tag, 'Socket closed');
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Connect to localhost! :)</Text>
        <Button title="Connect" onPress={this._connectSocket} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
