// eslint-disable-next-line no-unused-vars
import React from 'react';

//Import react-navigation
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import ViewAll from './pages/ViewAll';
import AddOne from './pages/AddOne';

import Realm from 'realm';
let realm;

realm = new Realm({
  path: 'ExamDatabase.realm',
  schema: [
    {
      name: 'exam_details',
      properties: {
        id: {type: 'int', default: 0},
        title: 'string',
        date: 'string',
      },
    },
  ],
});

const App = createStackNavigator({
  ViewAllScreen: {
    screen: ViewAll,
    navigationOptions: {
      title: 'Exam Practice',
      headerStyle: {backgroundColor: '#FA7F72'},
      headerTintColor: '#EBEBEB',
    },
  },
  Add: {
    screen: AddOne,
    navigationOptions: {
      title: 'Add page',
      headerStyle: {backgroundColor: '#FA7F72'},
      headerTintColor: '#EBEBEB',
    },
  },
});

export default createAppContainer(App);
