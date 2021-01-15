import React from 'react';
import {Button, FlatList, StyleSheet, Text, View} from 'react-native';
import {booksUrl} from './api/Service';
import NetworkUtils from './utils/NetworkUtils';

const Tag = 'WS';

export default class ViewAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {connected: false};
    window.navigator.userAgent = 'react-native';
    this.state = {
      FlatListItems: [],
    };
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

  async componentDidMount(): void {
    this.props.navigation.addListener(
        'didFocus',
        payload => {
          this.onlineFetch();
        }
    );
  }

  onlineFetch = async() => {
    this.timeout(1000, fetch(booksUrl + "/books"))
        .then(response => response.json())
        .then(data =>
          this.setState({
            FlatListItems: data,
          }))
        .catch(error => console.log(error))
  };

  ListViewItemSeparator = () => {
    return (
        <View style={{ height: 2, width: '100%', backgroundColor: '#389393' }} />
    );
  };

  render() {
    // style={styles.container}
    return (
      <View>
        <Text>Connect to localhost! :)</Text>
        <Button title="Connect" onPress={this._connectSocket} />
        <NetworkUtils />
        <FlatList
            data={this.state.FlatListItems}
            ItemSeparatorComponent={this.ListViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={{ backgroundColor: '#EBEBEB', padding: 20, flexDirection: 'row'}}>
                  <Text style={{alignItems: 'center'}}>{item.id}. &nbsp;&nbsp;</Text>
                  <Text style={{alignItems: 'center'}}>{item.title}</Text>

                </View>
            )}
        />
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
