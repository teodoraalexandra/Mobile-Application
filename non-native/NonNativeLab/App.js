import React from 'react';

//Import react-navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';

//Import necessary views (screens)
import AddAssignment from './pages/AddAssignment';
import UpdateAssignment from './pages/UpdateAssignment';
import DeleteAssignment from './pages/DeleteAssignment';
import ViewAssignment from './pages/ViewAssignment';
import ViewAllAssignments from './pages/ViewAllAssignments';

import Realm from 'realm';
import {assignmentsUrl} from "./pages/api/service";
let realm;

realm = new Realm({
    path: 'AssignmentDatabase.realm',
    schema: [
        {
            name: 'assignment_details',
            properties: {
                id: { type: 'int', default: 0 },
                title: 'string',
                course: 'string',
                number: 'int',
                mandatory: 'bool',
                problem: 'int',
                date: 'string',
            },
        },
    ],
});

const App = createStackNavigator({
    ViewAll: {
        screen: ViewAllAssignments,
        navigationOptions: {
            title: 'Assignment app',
            headerStyle: { backgroundColor: '#FA7F72' },
            headerTintColor: '#EBEBEB',
        },
    },
    View: {
        screen: ViewAssignment,
        navigationOptions: {
            title: 'Details',
            headerStyle: { backgroundColor: '#FA7F72' },
            headerTintColor: '#EBEBEB',
        },
    },
    Add: {
        screen: AddAssignment,
        navigationOptions: {
            title: 'Add assignment',
            headerStyle: { backgroundColor: '#FA7F72' },
            headerTintColor: '#EBEBEB',
        },
    },
    Update: {
        screen: UpdateAssignment,
        navigationOptions: {
            title: 'Update assignment',
            headerStyle: { backgroundColor: '#FA7F72' },
            headerTintColor: '#EBEBEB',
        },
    },
    Delete: {
        screen: DeleteAssignment,
        navigationOptions: {
            title: 'Delete assignment',
            headerStyle: { backgroundColor: '#FA7F72' },
            headerTintColor: '#EBEBEB',
        },
    },
});

export default createAppContainer(App);
