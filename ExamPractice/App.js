// eslint-disable-next-line no-unused-vars
import React from 'react';

//Import react-navigation
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import ViewAll from './pages/ViewAll';

const App = createStackNavigator({
  ViewAllScreen: {
    screen: ViewAll,
    navigationOptions: {
      title: 'Exam Practice',
      headerStyle: {backgroundColor: '#FA7F72'},
      headerTintColor: '#EBEBEB',
    },
  },
});

export default createAppContainer(App);
