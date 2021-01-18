import React from 'react';
import {FlatList, Text, View, List} from 'react-native';
import Realm from 'realm';
import {httpUrl, simpleUrl} from './api/Service';
import NetworkUtils from './utils/NetworkUtils';
import Details from './utils/Details';
import NetworkManager from './utils/NetworkManagerClass';
import MyButton from './components/MyButton';
import AsyncStorage from '@react-native-community/async-storage';
import axios from "axios";
import {ProgressBar, Colors} from 'react-native-paper';

let realm;

export default class ViewWaiter extends React.Component {
    constructor(props) {
        super(props);
        NetworkManager.RegisterConnectionChangeCallback((isAvailable) => {
            this.setState({});
        });
        realm = new Realm({path: 'OrderDatabase.realm'});
        window.navigator.userAgent = 'react-native';
        this.state = {
            data: [],
            offlineStack: [],
            loading: false,
        };
    }

    sleep = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    async componentDidUpdate(): void {
        const order = await AsyncStorage.getItem("order");
        AsyncStorage.removeItem("order");
        if (order !== null) {
            console.log("View Waiter: get data from async storage");
            const ord = JSON.parse(order);
            const newOrder = {
                table: ord.table,
                details: ord.details,
                status: ord.status,
                time: parseInt(ord.time),
                type: ord.type
            };
            this.setState({
                offlineStack: this.state.offlineStack.concat([newOrder])
            });
        }

        // Push the "offline-added" before re-creating the local DB
        await this.pushToServer();
    }

    componentDidMount(): void {
        this.props.navigation.addListener('didFocus', (payload) => {
            this.fetchFromServer();
        });
    }

    pushToServer = async () => {
        if (this.state.offlineStack.length !== 0 && NetworkManager.IsInternetAvailable) {
            console.log("Push offline stack to server: ", this.state.offlineStack);
            this.setState({loading: true});
            await this.sleep(5000);
            for (let i = 0; i <= this.state.offlineStack.length; i++) {
                await axios.post(httpUrl + "/order", this.state.offlineStack[i])
                    .then(() => {
                        // When we get to the last assignment, we clear the stack
                        if (i === this.state.offlineStack.length) {
                            this.setState({
                                offlineStack: [],
                            });
                        }
                    })
                    .catch(() => {
                        console.log("Still offline")
                    });

            }
            this.setState({loading: false});
        }
    };

    fetchFromServer = async () => {
        console.log("Fetch from server /orders");
        console.log("Network status: ", NetworkManager.IsInternetAvailable);

        if (NetworkManager.IsInternetAvailable) {
            this.setState({loading: true});
            await this.sleep(5000);
            await fetch(httpUrl + '/orders', {
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
                    console.log("View waiter fetch error:", error)
                });
            this.setState({loading: false});
        } else {
            this.setState({
                data: realm.objects('order_details'),
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
                <MyButton
                    title="Create new"
                    disabled={false}
                    customClick={() => this.props.navigation.navigate('Add')}
                />
                <ProgressBar
                    progress={0.5}
                    color={Colors.red800}
                    indeterminate={true}
                    style={{height: 25}}
                    visible={this.state.loading.toString() === 'true'}
                />
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
                            <Details orderId={item.id} navigation={this.props.navigation}/>
                        </View>
                    )}
                />
                <Text style={{padding: 25}}/>
            </View>
        );
    }
}

