// eslint-disable-next-line no-unused-vars
import React from 'react';

//Import react-navigation
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import ViewClient from './pages/ViewClient';
import ViewKitchen from './pages/ViewKitchen';
import ViewWaiter from './pages/ViewWaiter';
import MainPage from './pages/MainPage';
import AddOrderWaiter from './pages/AddOrderWaiter';
import ViewOrderDetails from './pages/ViewOrderDetails';
import EditOrderDetails from './pages/EditOrderDetails';

import Realm from 'realm';
let realm;

realm = new Realm({
  path: 'OrderDatabase.realm',
  schema: [
    {
      name: 'order_details',
      properties: {
        id: {type: 'int', default: 0},
        table: 'string',
        details: 'string',
        status: 'string',
        time: 'int',
        type: 'string'
      },
    },
  ],
});

const App = createStackNavigator({
  ViewMainScreen: {
    screen: MainPage,
    navigationOptions: {
      title: 'Main page',
      headerStyle: {backgroundColor: '#FA7F72'},
      headerTintColor: '#EBEBEB',
    },
  },
  ViewClient: {
    screen: ViewClient,
    navigationOptions: {
      title: 'View client',
      headerStyle: {backgroundColor: '#FA7F72'},
      headerTintColor: '#EBEBEB',
    },
  },
  ViewKitchen: {
    screen: ViewKitchen,
    navigationOptions: {
      title: 'View kitchen',
      headerStyle: {backgroundColor: '#FA7F72'},
      headerTintColor: '#EBEBEB',
    },
  },
  ViewWaiter: {
    screen: ViewWaiter,
    navigationOptions: {
      title: 'View waiter',
      headerStyle: {backgroundColor: '#FA7F72'},
      headerTintColor: '#EBEBEB',
    },
  },
  Add: {
    screen: AddOrderWaiter,
    navigationOptions: {
      title: 'Add order',
      headerStyle: {backgroundColor: '#FA7F72'},
      headerTintColor: '#EBEBEB',
    },
  },
  View: {
    screen: ViewOrderDetails,
    navigationOptions: {
      title: 'View order details',
      headerStyle: {backgroundColor: '#FA7F72'},
      headerTintColor: '#EBEBEB',
    },
  },
  Update: {
    screen: EditOrderDetails,
    navigationOptions: {
      title: 'View order details',
      headerStyle: {backgroundColor: '#FA7F72'},
      headerTintColor: '#EBEBEB',
    },
  },
});

export default createAppContainer(App);
