/*Screen to view single assignment*/
import React from 'react';
import { Text, View,ScrollView, StyleSheet, Alert } from 'react-native';
import MyButton from './components/MyButton';
import Realm from 'realm';
import {httpUrl} from './api/Service';
import axios from 'axios';
import MyTextInput from './components/MyTextInput';
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
        alignItems: "center",
        backgroundColor: '#ebebeb',
        marginTop: 20,
        marginBottom: 20,
        height: 50
    },
    text: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        height: 24
    },
    textCheck: {
        flex: 1,
        backgroundColor: '#ebebeb',
        paddingTop: 16,
        paddingBottom: 16
    }
});

export default class EditOrderDetails extends React.Component {
    constructor(props) {
        super(props);
        realm = new Realm({path: 'OrderDatabase.realm'});
        this.state = {
            id: this.props.navigation.getParam("orderId"),
            orderData: '',
            status: ''
        };
    }

    componentDidMount() {
        console.log("Find order with id: ", this.state.id)
        fetch(httpUrl + '/order/' + this.state.id, {
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
                this.setState({ orderData: data })
            )
            .catch(error => {
                console.log("View details fetch error:", error)
            });
    }

    timeout(ms, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("timeout"))
            }, ms);
            promise.then(resolve, reject)
        })
    }

    update = () => {
        const that = this;

            const updatedOrder = {
                id: this.state.id,
                status: this.state.status,
            };

            console.log("Modifying order ", this.state.id, " with: ", this.state.status);

            // Update to server
            this.timeout(1000, axios.post(httpUrl + "/status", updatedOrder))
                .then((res) => { Alert.alert(
                    'Success',
                    'Updated successfully',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                that.props.navigation.pop()
                            }
                        },
                    ],
                    {cancelable: false}); })
                .catch((error) => console.log("Update error: ", error));
    };


    render() {
        return (
            <View>
                <View style={{marginLeft: 35, marginRight: 35, marginTop: 16, padding: 20, borderWidth: 5, borderColor: '#389393' }}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>Id: {this.state.orderData.id}</Text>
                        <View style={InitWindowStyles.rowContainer}>
                            <Text style={InitWindowStyles.text}>Old status:</Text>
                            <Text style={InitWindowStyles.text}>{this.state.orderData.status}</Text>
                        </View>

                        <View style={InitWindowStyles.rowContainer}>
                            <Text style={InitWindowStyles.text}>Status</Text>
                            <MyTextInput
                                value={this.state.status}
                                placeholder="Enter new status"
                                onChangeText={status => this.setState({ status })}
                            />
                        </View>

                    <MyButton
                        title="Update"
                        customClick={this.update.bind(this)}
                    />
                    </ScrollView>
                </View>
            </View>
        );
    }
}



