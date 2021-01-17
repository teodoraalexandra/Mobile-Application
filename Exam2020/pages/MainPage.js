import React from 'react';
import {View} from 'react-native';
import MyButton from './components/MyButton';

export default class ViewAll extends React.Component {
    constructor(props) {
        super(props);
        window.navigator.userAgent = 'react-native';
    }

    render() {
        return (
            <View style={{
                backgroundColor: '#EBEBEB',
                padding: 20,
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1
            }}>
                <MyButton
                    title="Waiter section"
                    customClick={() => this.props.navigation.navigate('ViewWaiter')}
                />
                <MyButton
                    title="Kitchen section"
                    customClick={() => this.props.navigation.navigate('ViewKitchen')}
                />
                <MyButton
                    title="Client section"
                    customClick={() => this.props.navigation.navigate('ViewClient')}
                />
            </View>
        );
    }
}
