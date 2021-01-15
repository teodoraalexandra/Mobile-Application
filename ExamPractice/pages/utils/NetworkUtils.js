import React from 'react';
import {Text, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';

const NetworkUtils = () => {
  const netInfo = useNetInfo();

  return (
    <View>
      <Text>Type: {netInfo.type}</Text>
      <Text>Is Connected? {netInfo.isConnected.toString()}</Text>
    </View>
  );
};

export default NetworkUtils;
