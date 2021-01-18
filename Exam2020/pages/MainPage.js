import React from 'react';
import {View} from 'react-native';
import MyButton from './components/MyButton';
import MyTextInput from './components/MyTextInput';
import {webSocket} from './utils/WebSocket';

export default class ViewAll extends React.Component {
    constructor(props) {
        super(props);
        window.navigator.userAgent = 'react-native';
        this.state = {
            table: '',
        };
    }

    componentDidMount(): void {
        webSocket();
    }

    render() {
        return (
            <View style={{
                backgroundColor: '#EBEBEB',
                padding: 20,
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
            }}>
                <MyButton
                    title="Waiter section"
                    customClick={() => this.props.navigation.navigate('ViewWaiter')}
                />
                <MyButton
                    title="Kitchen section"
                    customClick={() => this.props.navigation.navigate('ViewKitchen')}
                />
                <View style={{
                    backgroundColor: '#EBEBEB',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginLeft: 35,
                    paddingTop: 20
                }}>
                <MyTextInput
                    value={this.state.table}
                    placeholder="Enter table"
                    onChangeText={table => this.setState({ table })}
                />
                <MyButton
                    title="Client section"
                    customClick={() => this.props.navigation.navigate('ViewClient', { table: this.state.table})}
                />
                </View>
            </View>
        );
    }
}
