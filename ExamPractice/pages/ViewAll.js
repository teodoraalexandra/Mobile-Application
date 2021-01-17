import React from 'react';
import {FlatList, Text, View} from 'react-native';
import Realm from 'realm';
import {httpUrl, simpleUrl} from './api/Service';
import NetworkUtils from './utils/NetworkUtils';

let realm;
const Tag = 'WS';

export default class ViewAll extends React.Component {
  constructor(props) {
    super(props);
    realm = new Realm({path: 'ExamDatabase.realm'});
    window.navigator.userAgent = 'react-native';
    this.state = {
      data: [],
    };
    this.fetchFromServer().then((r) => {});
  }

  componentDidMount(): void {
    const ws = new WebSocket('ws://' + simpleUrl);
    ws.onerror = (e) => {
      console.trace(Tag, 'Error', e.message);
    };

    ws.onopen = (ws, event) => {
      console.trace(Tag, 'Socket open');
    };

    ws.onclose = () => {
      console.trace(Tag, 'Socket closed');
    };

    ws.onmessage = async function (event) {
      console.trace(Tag, 'Socket received message');
      const json = JSON.parse(event.data);
      const fromWS = {
        id: json.id,
        title: json.title,
        date: json.date.toString(),
      };
      realm.write(() => {
        realm.create('exam_details', fromWS);
      });
    };

    this.props.navigation.addListener('didFocus', (payload) => {
      this.setState({
        data: realm.objects('exam_details'),
      });
    });
  }

  fetchFromServer = async () => {
    console.trace('Fetching from server');
    fetch(httpUrl + '/books', {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        Pragma: 'no-cache',
        'Cache-control': 'no-cache',
      },
    })
      .then((response) => response.json())
      .then((data) =>
        realm.write(() => {
          realm.delete(realm.objects('exam_details'));
          for (let i = 0; i < data.length; i++) {
            realm.create('exam_details', {
              id: data[i].id,
              title: data[i].title,
              date: data[i].date.toString(),
            });
          }
        }),
      )
      .catch((error) => console.trace('Offline', error));
  };

  ListViewItemSeparator = () => {
    return (
      <View style={{height: 2, width: '100%', backgroundColor: '#389393'}} />
    );
  };

  render() {
    return (
      <View>
        <NetworkUtils navigation={this.props.navigation} />
        <FlatList
          data={realm.objects('exam_details')}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={{
                backgroundColor: '#EBEBEB',
                padding: 20,
                flexDirection: 'row',
              }}>
              <Text style={{alignItems: 'center'}}>
                {item.id}. &nbsp;&nbsp;
              </Text>
              <Text style={{alignItems: 'center'}}>{item.title}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}
