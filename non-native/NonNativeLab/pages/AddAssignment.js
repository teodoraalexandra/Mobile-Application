/*Screen to add the assignment*/
import React from 'react';
import {View, ScrollView, StyleSheet, Alert, Text } from 'react-native';
import MyTextInput from './components/MyTextInput';
import MyButton from './components/MyButton';
import Realm from 'realm';
import CheckBox from "@react-native-community/checkbox";
import { assignmentsUrl } from "./api/service";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage'
import * as NavigationActions from "react-navigation";
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

export default class AddAssignment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            course: '',
            number: '',
            mandatory: false,
            problem: '',
            date: '',
        };
        realm = new Realm({ path: 'AssignmentDatabase.realm' });
    }

    timeout(ms, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("timeout"))
            }, ms);
            promise.then(resolve, reject)
        })
    }

    add_assignment = async () => {
        const that = this;
        const { title } = this.state;
        const { course } = this.state;
        const { number } = this.state;
        const { mandatory } = this.state;
        const { problem } = this.state;
        const { date } = this.state;

        if (title && course && number && problem && date) {
            const newAssignment = {
                title: this.state.title,
                course: this.state.course,
                number: parseInt(this.state.number),
                mandatory: this.state.mandatory,
                problem: parseInt(this.state.problem),
                date: this.state.date,
            };

            // Add to server
            this.timeout(1000, axios.post(assignmentsUrl, newAssignment))
                .then((res) => {  Alert.alert(
                    'Success',
                    'Assignment added successfully',
                    [
                        {
                            text: 'Ok',
                            onPress: () => this.props.navigation.pop()
                        },
                    ],
                    {cancelable: false}); })
                .catch((error) => {
                    const ID =
                        realm.objects('assignment_details').sorted('id', true).length > 0
                            ? realm.objects('assignment_details').sorted('id', true)[0]
                            .id + 1
                            : 1;
                    const newAssignment = this.add_to_database(ID);
                    AsyncStorage.setItem("assignment", JSON.stringify(newAssignment));
                    Alert.alert(
                    'Warning',
                    'The assignment is saved only locally until you will be back online',
                    [
                        {
                            text: 'Ok',
                            onPress: () => this.props.navigation.pop()
                        },
                    ],
                    { cancelable: false }
                );});


        } else {
            alert('Please fill all fields');
        }
    };

    add_to_database = (ID) => {
        const newAssignment = {
            id: ID,
            title: this.state.title,
            course: this.state.course,
            number: parseInt(this.state.number),
            mandatory: this.state.mandatory,
            problem: parseInt(this.state.problem),
            date: this.state.date,
        };
        realm.write(() => {
            realm.create('assignment_details', newAssignment);
        });
        return newAssignment;
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
                        <Text style={InitWindowStyles.text}>Course</Text>
                        <MyTextInput
                            placeholder="Enter course"
                            onChangeText={course => this.setState({ course })}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Number</Text>
                        <MyTextInput
                            placeholder="Enter number"
                            onChangeText={number => this.setState({ number })}
                            keyboardType="numeric"
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.textCheck}>Mandatory</Text>
                        <View style={{
                            flex: 1,
                            color: "#389393",
                            backgroundColor: '#ffffff',
                            height: 48
                        }}>
                            <CheckBox
                            value={this.state.mandatory}
                            onValueChange={() => this.setState({ mandatory: !this.state.mandatory})}
                            style={{ textAlignVertical: 'top', marginTop: 5}}
                            />
                        </View>
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Problem</Text>
                        <MyTextInput
                            placeholder="Enter problem"
                            onChangeText={problem => this.setState({ problem })}
                            keyboardType="numeric"
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Date</Text>
                        <MyTextInput
                            placeholder="Enter date"
                            onChangeText={date => this.setState({ date })}
                        />
                    </View>

                    <MyButton
                        title="Add"
                        customClick={this.add_assignment.bind(this)}
                    />
                </ScrollView>
            </View>
        );
    }
}
