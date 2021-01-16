/*Custom TextInput*/
import React from 'react';
import { View, TextInput } from 'react-native';

const MyTextInput = props => {
    return (
        <View
            style={{
                flex: 1,
                color: "#389393",
                backgroundColor: '#ffffff'
            }}>
            <TextInput
                placeholder={props.placeholder}
                placeholderTextColor="#389393"
                keyboardType={props.keyboardType}
                onChangeText={props.onChangeText}
                returnKeyType={props.returnKeyType}
                numberOfLines={props.numberOfLines}
                multiline={props.multiline}
                onSubmitEditing={props.onSubmitEditing}
                style={props.style}
                blurOnSubmit={false}
                value={props.value}
                type={props.type}
            />
        </View>
    );
};

export default MyTextInput;
