import React from 'react';
import {Text, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import MyButton from '../components/MyButton';

const Details = ({orderId, navigation}) => {
    const netInfo = useNetInfo();
    if (netInfo.isConnected) {
        return (
            <MyButton title="See details" disabled={false} customClick = {() =>
                navigation.navigate('View', { orderId: orderId })}/>
        );
    } else {
        return (
            <MyButton title="See details" disabled={true} customClick = {() =>
                navigation.navigate('View', { orderId: orderId })}/>
        );
    }
};

export default Details;

