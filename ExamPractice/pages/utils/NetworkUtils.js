import React from 'react';
import {Text, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import MyButton from '../components/MyButton';

const NetworkUtils = ({navigation}) => {
  const netInfo = useNetInfo();
  if (netInfo.isConnected) {
    return (
      <View>
        <Text
          style={{
            alignItems: 'center',
            backgroundColor: '#389393',
            color: '#ffffff',
            padding: 10,
            marginBottom: 16,
          }}>
          You are online
        </Text>
        <MyButton
          title="Create new"
          disabled={false}
          customClick={() => navigation.navigate('Add')}
        />
      </View>
    );
  } else {
    return (
      <View>
        <Text
          style={{
            alignItems: 'center',
            backgroundColor: '#389393',
            color: '#ffffff',
            padding: 10,
            marginBottom: 16,
          }}>
          You are offline
        </Text>
        <MyButton
          title="Disabled"
          disabled={true}
          customClick={() => navigation.navigate('Add')}
        />
      </View>
    );
  }
};

export default NetworkUtils;
