/*Screen to delete the assignment*/
import React from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import Realm from 'realm';
import { withNavigation } from 'react-navigation';
import axios from 'axios';
import {assignmentsUrl} from "./api/service";
let realm;

const styles = StyleSheet.create ({
    container: {
        alignItems: 'center',
        backgroundColor: '#f05555',
        color: '#ffffff',
        padding: 10,
        marginTop: 16,
        marginLeft: 35,
        marginRight: 35,
        marginBottom: 16,
        borderRadius: 10
    },
    modal: {
        padding: 50,
        alignItems: 'center',
        backgroundColor: '#f05555',
        width: 300,
        height: 300,
        fontSize: 34,
    },
    text: {
        color: '#ffffff',
    },
    modalText: {
        color: '#ffffff',
        fontSize: 20,
        textAlign: 'center',
        paddingBottom: 30
    },
    modalButton: {
        color: '#ffffff',
        fontSize: 20,
        textAlign: 'center',
        padding: 5,
        marginTop: 5,
        marginBottom: 5,
        width: 100,
        backgroundColor: '#389393',
        borderRadius: 10
    }
});

class DeleteAssignment extends React.Component {
    constructor(props) {
        super(props);
        realm = new Realm({ path: 'AssignmentDatabase.realm' });
    }

    state = {
        modalVisible: false,
    };

    toggleModal(visible) {
        this.setState({ modalVisible: visible });
    };

    timeout(ms, promise) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("timeout"))
            }, ms);
            promise.then(resolve, reject)
        })
    }

    deleteAssignment = () => {
        const id = this.props.assignmentId;
        // Delete from server
        this.timeout(1000, axios.delete(assignmentsUrl + "/" + id))
            .then((res) => {
                Alert.alert(
                'Success',
                'Assignment deleted successfully',
                [
                    {
                        text: 'Ok',
                        onPress: () => this.props.navigation.pop(2),
                    },
                ],
                { cancelable: false }
            );})
            .catch((error) => { Alert.alert(
                'Error',
                'You can not delete assignments right now',
                [
                    {
                        text: 'Go to main screen',
                        onPress: () => this.props.navigation.pop(2),
                    },
                ],
                { cancelable: false }
            );});

        this.toggleModal(!this.state.modalVisible);
    };
    render() {
        return (
            <View style = {styles.container}>
                <Modal animationType = {"slide"} transparent = {true}
                       visible = {this.state.modalVisible}
                       onRequestClose = {() => {}}>

                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'}}>
                    <View style = {styles.modal}>
                        <Text style = {styles.modalText}>Are you sure you want to delete this assignment?</Text>

                        <TouchableHighlight onPress = {() => {
                            this.toggleModal(!this.state.modalVisible)}}>

                            <Text style = {styles.modalButton}>No</Text>
                        </TouchableHighlight>

                        <TouchableOpacity onPress={this.deleteAssignment.bind(this)}>
                            <Text style={styles.modalButton}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal>

                <TouchableHighlight onPress = {() => {this.toggleModal(true)}}>
                    <Text style = {styles.text}>Delete assignment</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

export default withNavigation(DeleteAssignment)

