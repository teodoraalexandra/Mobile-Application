import React from 'react';
import {FlatList, Text, View} from 'react-native';
import Realm from 'realm';
import {httpUrl, simpleUrl} from './api/Service';
import NetworkUtils from './utils/NetworkUtils';
import NetworkManager from './utils/NetworkManagerClass';
import Details from './utils/Details';
import MyButton from './components/MyButton';

let realm;
const Tag = 'WS';

export default class ViewKitchen extends React.Component {
    constructor(props) {
        super(props);
        NetworkManager.RegisterConnectionChangeCallback((isAvailable) => {
            this.setState({});
        });
        realm = new Realm({path: 'OrderDatabase.realm'});
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
                table: json.table,
                details: json.details,
                status: json.status,
                time:  json.time,
                type: json.type
            };
        };

        this.props.navigation.addListener('didFocus', (payload) => {
            this.fetchFromServer();
        });
    }

    fetchFromServer = async () => {
        if (NetworkManager.IsInternetAvailable) {
            await fetch(httpUrl + '/recorded', {
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
                        realm.delete(realm.objects('order_details'));
                        for (let i = 0; i < data.length; i++) {
                            realm.create('order_details', {
                                id: data[i].id,
                                table: data[i].table,
                                details: data[i].details,
                                status: data[i].status,
                                time: data[i].time,
                                type: data[i].type
                            });
                        }
                        this.setState({
                            data: realm.objects('order_details')
                        });
                    }),
                )
                .catch(error => {
                    console.log("View kitchen fetch error:", error)
                });
        } else {
            this.setState({
                data: [],
            });
            console.log("Offline user");
        }
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
                    inverted
                    data={this.state.data}
                    ItemSeparatorComponent={this.ListViewItemSeparator}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                        <View
                            style={{
                                backgroundColor: '#EBEBEB',
                                padding: 10,
                                flexDirection: 'row',
                            }}>
                            <Text style={{alignItems: 'center'}}>
                                {item.id}. &nbsp;&nbsp;
                            </Text>
                            <Text style={{alignItems: 'center'}}>{item.table} &nbsp;</Text>
                            <Text style={{alignItems: 'center'}}>{item.status}</Text>
                            <MyButton title="Update" disabled={false} customClick = {() =>
                                this.props.navigation.navigate('Update', { orderId: item.id })}/>
                        </View>
                    )}
                />
            </View>
        );
    }
}
