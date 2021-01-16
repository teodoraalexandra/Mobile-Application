import React from 'react';
import {View, ScrollView, StyleSheet, Alert, Text } from 'react-native';
import Realm from 'realm';
import { httpUrl } from "./api/Service";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage'
import * as NavigationActions from "react-navigation";
import MyTextInput from './components/MyTextInput';
import MyButton from './components/MyButton';
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

export default class AddOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            date: '',
        };
        realm = new Realm({ path: 'ExamDatabase.realm' });
    }

    add_object = async () => {
        const that = this;
        const { title } = this.state;
        const { date } = this.state;

        if (title) {
            const newObject = {
                title: this.state.title,
                //date: this.state.date,
                //date: new Date()
            };
            //console.log(newObject);

            // Add to server
            axios.post(httpUrl + "/book", newObject)
                .then((res) => {  Alert.alert(
                    'Success',
                    'Added successfully',
                    [
                        {
                            text: 'Ok',
                            onPress: () => this.props.navigation.pop()
                        },
                    ],
                    {cancelable: false}); })
                .catch((error) => { console.log(error)});
        } else {
            alert('Please fill all fields');
        }
    };

    render() {
        return (
            <View style={InitWindowStyles.root}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Title</Text>
                        <MyTextInput
                            placeholder="Enter title"
                            onChangeText={title => this.setState({ title })}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Date</Text>
                        <MyTextInput
                            placeholder="Enter date"
                            value={new Date().toDateString()}
                            onChangeText={date => this.setState({ date })}
                        />
                    </View>

                    <MyButton
                        title="Add"
                        customClick={this.add_object.bind(this)}
                    />
                </ScrollView>
            </View>
        );
    }
}
