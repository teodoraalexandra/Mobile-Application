/*Screen to view single assignment*/
import React from 'react';
import { Text, View } from 'react-native';
import MyButton from './components/MyButton';
import Realm from 'realm';
import {httpUrl} from './api/Service';
import {webSocket} from './utils/WebSocket';
let realm;

export default class ViewClient extends React.Component {
    constructor(props) {
        super(props);
        realm = new Realm({path: 'OrderDatabase.realm'});
        this.state = {
            table: this.props.navigation.getParam("table"),
            orderData: '',
            notFound: false
        };
    }

    componentDidMount() {
        console.log("Find order from table: ", this.state.table);
        fetch(httpUrl + '/my/' + this.state.table, {
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
                this.setState({ orderData: data, notFound: false })
            )
            .catch(error => {
                console.log("Table not found [ViewClient]: ", error);
                this.setState({ orderData: [], notFound: true })
            });
    }

    render() {
        if (this.state.notFound) {
            return (
                <View>
                    <View style={{marginLeft: 35, marginRight: 35, marginTop: 16, padding: 20, borderWidth: 5, borderColor: '#389393' }}>
                        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>Sorry :( I did not found table {this.state.table}</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View>
                    <View style={{
                        marginLeft: 35,
                        marginRight: 35,
                        marginTop: 16,
                        padding: 20,
                        borderWidth: 5,
                        borderColor: '#389393'
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 20,
                            fontWeight: 'bold'
                        }}>Id: {this.state.orderData.id}</Text>
                        <Text style={{textAlign: 'center', fontSize: 18}}>Table: {this.state.orderData.table}</Text>
                        <Text style={{textAlign: 'center', fontSize: 18}}>Details: {this.state.orderData.details}</Text>
                        <Text style={{textAlign: 'center', fontSize: 18}}>Status: {this.state.orderData.status}</Text>
                        <Text style={{textAlign: 'center', fontSize: 18}}>Time: {this.state.orderData.time}</Text>
                        <Text style={{textAlign: 'center', fontSize: 18}}>Type: {this.state.orderData.type}</Text>
                    </View>
                </View>
            );
        }
    }
}

