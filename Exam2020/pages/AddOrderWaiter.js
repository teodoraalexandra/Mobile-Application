/*Screen to add the assignment*/
import React from 'react';
import {View, ScrollView, StyleSheet, Alert, Text } from 'react-native';
import MyTextInput from './components/MyTextInput';
import MyButton from './components/MyButton';
import Realm from 'realm';
import { httpUrl, simpleUrl } from "./api/Service";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage'
import NetworkManager from './utils/NetworkManagerClass';
import {webSocket} from './utils/WebSocket';
let realm;

const InitWindowStyles = StyleSheet.create({
    root: {
        flexDirection: "column",
        backgroundColor: '#389393',
        marginLeft: 35,
        marginRight: 35,
        marginTop: 16,
        marginBottom: 16,
        padding: 20
    },
    rowContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: '#ebebeb',
        paddingLeft: 20,
        marginTop: 10
    },
    text: {
        flex: 1,
        backgroundColor: '#ebebeb'
    },
    textCheck: {
        flex: 1,
        backgroundColor: '#ebebeb',
        paddingTop: 16,
        paddingBottom: 16
    }
});

export default class AddOrderWaiter extends React.Component {
    constructor(props) {
        super(props);
        NetworkManager.RegisterConnectionChangeCallback((isAvailable) => {
            this.setState({});
        });
        this.state = {
            id: '',
            table: '',
            details: '',
            status: '',
            time: '',
            type: ''
        };
        realm = new Realm({ path: 'OrderDatabase.realm' });
    }

    async timeout(ms, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("timeout"))
            }, ms);
            promise.then(resolve, reject)
        })
    }

    add_order = async () => {
        const that = this;
        const { table } = this.state;
        const { details } = this.state;
        const { status } = this.state;
        const { time } = this.state;
        const { type } = this.state;

        if (table) {
            const newOrder = {
                table: this.state.table,
                details: this.state.details,
                status: this.state.status,
                time: parseInt(this.state.time),
                type: this.state.type,
            };

            // Add to server
            if (NetworkManager.IsInternetAvailable) {
                this.timeout(1000, axios.post(httpUrl + "/order", newOrder))
                    .then((res) => {
                       Alert.alert(
                            'Success',
                            'Added successfully',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => this.props.navigation.pop()
                                },
                            ],
                            {cancelable: false});
                    })
                    .catch((error) => {
                        console.log("Add error: ", error);
                    });
            } else {
                const ID =
                    realm.objects('order_details').sorted('id', true).length > 0
                        ? realm.objects('order_details').sorted('id', true)[0]
                        .id + 1
                        : 1;
                const newOrder = this.add_to_database(ID);
                AsyncStorage.setItem("order", JSON.stringify(newOrder));
                console.log("Added to DB and set to Async Storage");
                Alert.alert(
                    'Warning',
                    'This is saved only locally until you will be back online',
                    [
                        {
                            text: 'Ok',
                            onPress: () => this.props.navigation.pop()
                        },
                    ],
                    {cancelable: false}
                );
            }


        } else {
            alert('Please fill all fields');
        }
    };

    add_to_database = (ID) => {
        const newOrder = {
            id: ID,
            table: this.state.table,
            details: this.state.details,
            status: this.state.status,
            time: parseInt(this.state.time),
            type: this.state.type,
        };
        realm.write(() => {
            realm.create('order_details', newOrder);
        });
        return newOrder;
    };

    render() {
        return (
            <View style={InitWindowStyles.root}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Table</Text>
                        <MyTextInput
                            placeholder="Enter table"
                            onChangeText={table => this.setState({ table })}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Details</Text>
                        <MyTextInput
                            placeholder="Enter details"
                            onChangeText={details => this.setState({ details })}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Status</Text>
                        <MyTextInput
                            placeholder="Enter status"
                            onChangeText={status => this.setState({ status })}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Time</Text>
                        <MyTextInput
                            placeholder="Enter time"
                            onChangeText={time => this.setState({ time })}
                            keyboardType="numeric"
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Type</Text>
                        <MyTextInput
                            placeholder="Enter type"
                            onChangeText={type => this.setState({ type })}
                        />
                    </View>

                    <MyButton
                        title="Add"
                        customClick={this.add_order.bind(this)}
                    />
                </ScrollView>
            </View>
        );
    }
}
