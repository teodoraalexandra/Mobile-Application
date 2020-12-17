/*Screen to view single assignment*/
import React from 'react';
import { Text, View } from 'react-native';
import MyButton from './components/MyButton';
import Realm from 'realm';
import DeleteAssignment from "./DeleteAssignment";
let realm;

export default class ViewAssignment extends React.Component {
    constructor(props) {
        super(props);
        realm = new Realm({path: 'AssignmentDatabase.realm'});
        this.state = {
            id: this.props.navigation.getParam("assignmentId"),
            assignmentData: ''
        };
    }

    componentDidMount() {
        const assignment_details = realm
            .objects('assignment_details')
            .filtered('id =' + this.state.id);
        this.setState({ assignmentData: assignment_details[0] });
    }

    render() {
        return (
            <View>
                <View style={{marginLeft: 35, marginRight: 35, marginTop: 16, padding: 20, borderWidth: 5, borderColor: '#389393' }}>
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>Id: {this.state.assignmentData.id}</Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Title: {this.state.assignmentData.title}</Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Course: {this.state.assignmentData.course}</Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Number #{this.state.assignmentData.number}</Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Mandatory: {this.state.assignmentData.mandatory ? "Yes" : "No"}</Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Problem #{this.state.assignmentData.problem}</Text>
                    <Text style={{textAlign: 'center', fontSize: 18}}>Due date: {this.state.assignmentData.date}</Text>

                    <MyButton title="Edit assignment" customClick = {() =>
                        this.props.navigation.navigate('Update', { assignmentId: this.state.assignmentData.id })}/>

                    <DeleteAssignment
                        assignmentId={this.state.assignmentData.id}/>
                </View>
            </View>
        );
    }
}

