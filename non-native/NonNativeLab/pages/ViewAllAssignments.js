/*Screen to view all the assignments*/
import React from 'react';
import {FlatList, Text, View} from 'react-native';
import Realm from 'realm';
import MyButton from "./components/MyButton";
import { assignmentsUrl } from "./api/service";
import AsyncStorage from '@react-native-community/async-storage'
import axios from "axios";
let realm;

export default class ViewAllAssignments extends React.Component {
    constructor(props) {
        super(props);
        realm = new Realm({ path: 'AssignmentDatabase.realm' });
        this.state = {
            FlatListItems: [],
            offline: false,
            AssignmentStack: [],
            push: false
        };
    }

    async componentDidUpdate() {
        const assignment = await AsyncStorage.getItem("assignment");
        AsyncStorage.removeItem("assignment");
        if (assignment !== null) {
            const ass = JSON.parse(assignment);
            const newAssignment = {
                title: ass.title,
                course: ass.course,
                number: parseInt(ass.number),
                mandatory: ass.mandatory,
                problem: parseInt(ass.problem),
                date: ass.date,
            };
            this.setState({
                AssignmentStack: this.state.AssignmentStack.concat([newAssignment])
            });
        }
    }

    async componentDidMount() {
        this.props.navigation.addListener(
            'didFocus',
            payload => {
                // Synchronize server with local DB
                this.sync();
            }
        );
    }

    timeout(ms, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("timeout"))
            }, ms);
            promise.then(resolve, reject)
        })
    }

    pushToServer = async () => {
        if (this.state.AssignmentStack.length !== 0 && !this.state.push) {
            for (let i = 0; i <= this.state.AssignmentStack.length; i++) {
                this.timeout(1000, axios.post(assignmentsUrl, this.state.AssignmentStack[i]))
                    .then(() => {
                        // When we get to the last assignment, we clear the stack
                        if (i === this.state.AssignmentStack.length) {
                            this.setState({
                                AssignmentStack: [],
                                push: false,
                            });
                        }
                    })
                    .catch(() => {
                        console.log("Still offline")
                    });

            }
        }
    };

    sync = async () => {
        // Push the "offline-added" assignments before re-creating the local DB
        await this.pushToServer();

        // SERVER TO DB sync
        this.timeout(1000, fetch(assignmentsUrl))
            .then(response => response.json())
            .then(data => realm.write(() => {
                realm.delete(realm.objects('assignment_details'));
                for (let i = 0; i < data.length; i ++) {
                    realm.create('assignment_details', {
                        id: data[i].id,
                        title: data[i].title,
                        course: data[i].course,
                        number: parseInt(data[i].number),
                        mandatory: data[i].mandatory,
                        problem: parseInt(data[i].problem),
                        date: data[i].date,
                    });
                }
                this.setState({
                    FlatListItems: realm.objects('assignment_details'),
                    offline: false
                });
            }))
            .catch(error => this.setState({
                FlatListItems: realm.objects('assignment_details'),
                offline: true,
                push: true
            }));
    };

    ListViewItemSeparator = () => {
        return (
            <View style={{ height: 2, width: '100%', backgroundColor: '#389393' }} />
        );
    };

    render() {
        let message;
        if (this.state.offline) {
            message = <Text style={{alignItems: 'center',
                backgroundColor: '#389393',
                color: '#ffffff',
                padding: 10,
                marginBottom: 16}}>You are currently offline. Update and delete features will be enabled when you will be back online.</Text>;
        } else {
            message = <Text/>;
        }

        return (
            <View>
                {message}
                <MyButton title="Create assignment" customClick = {() =>
                    this.props.navigation.navigate('Add')}/>
                <FlatList
                    data={this.state.FlatListItems}
                    ItemSeparatorComponent={this.ListViewItemSeparator}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ backgroundColor: '#EBEBEB', padding: 20, flexDirection: 'row'}}>
                            <Text style={{alignItems: 'center'}}>{item.id}. &nbsp;&nbsp;</Text>
                            <Text style={{alignItems: 'center'}}>{item.title}</Text>

                            <View style={{position: 'absolute', right: 0}}>
                                <MyButton title="See details" customClick = {() =>
                                    this.props.navigation.navigate('View', { assignmentId: item.id })}/>
                            </View>
                        </View>
                    )}
                />
            </View>
        );
    }
}
