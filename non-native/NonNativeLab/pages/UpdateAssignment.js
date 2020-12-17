/*Screen to update the assignment*/
import React from 'react';
import {
    View,
    ScrollView,
    Alert, Text, StyleSheet,
} from 'react-native';
import MyTextInput from './components/MyTextInput';
import MyButton from './components/MyButton';
import Realm from 'realm';
import CheckBox from "@react-native-community/checkbox";
import axios from 'axios';
import {assignmentsUrl} from "./api/service";
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

export default class UpdateAssignment extends React.Component {
    constructor(props) {
        super(props);
        realm = new Realm({ path: 'AssignmentDatabase.realm' });
        this.state = {
            id: this.props.navigation.getParam("assignmentId"),
            title: '',
            course: '',
            number: '',
            mandatory: false,
            problem: '',
            date: '',
        };
    }

    componentDidMount() {
        const assignment_details = realm
            .objects('assignment_details')
            .filtered('id =' + this.state.id);
        if (assignment_details.length > 0) {
            this.setState({
                title: assignment_details[0].title,
            });
            this.setState({
                course: assignment_details[0].course,
            });
            this.setState({
                number: assignment_details[0].number.toString(),
            });
            this.setState({
                mandatory: assignment_details[0].mandatory,
            });
            this.setState({
                problem: assignment_details[0].problem.toString(),
            });
            this.setState({
                date: assignment_details[0].date,
            });
        } else {
            alert('Assignment not found');
            this.setState({
                title: '',
            });
            this.setState({
                course: '',
            });
            this.setState({
                number: '',
            });
            this.setState({
                mandatory: '',
            });
            this.setState({
                problem: '',
            });
            this.setState({
                date: '',
            });
        }
    }

    timeout(ms, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("timeout"))
            }, ms);
            promise.then(resolve, reject)
        })
    }

    updateAssignment = () => {
        const that = this;
        const { input_id } = this.state;
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

            // Update to server
            this.timeout(1000, axios.put(assignmentsUrl + "/" + this.state.id, newAssignment))
                .then((res) => { Alert.alert(
                    'Success',
                    'Assignment updated successfully',
                    [
                        {
                            text: 'Ok',
                            onPress: () => {
                                that.props.navigation.pop(2)
                            }
                        },
                    ],
                    {cancelable: false}); })
                .catch((error) => { Alert.alert(
                    'Error',
                    'You can not update assignments right now',
                    [
                        {
                            text: 'Go to main screen',
                            onPress: () => this.props.navigation.pop(2),
                        },
                    ],
                    { cancelable: false }
                );});

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
                            value={this.state.title}
                            placeholder="Enter title"
                            onChangeText={title => this.setState({ title })}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Course</Text>
                        <MyTextInput
                            value={this.state.course}
                            placeholder="Enter course"
                            onChangeText={course => this.setState({ course })}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Number</Text>
                        <MyTextInput
                            value={this.state.number}
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
                            value={this.state.problem}
                            placeholder="Enter problem"
                            onChangeText={problem => this.setState({ problem })}
                            keyboardType="numeric"
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>

                    <View style={InitWindowStyles.rowContainer}>
                        <Text style={InitWindowStyles.text}>Date</Text>
                        <MyTextInput
                            value={this.state.date}
                            placeholder="Enter date"
                            onChangeText={date => this.setState({ date })}
                        />
                    </View>

                    <MyButton
                        title="Update"
                        customClick={this.updateAssignment.bind(this)}
                    />
                </ScrollView>
            </View>
        );
    }
}

