import React from 'react';
import {simpleUrl} from '../api/Service';
import {Alert} from 'react-native';

const Tag = 'WS';

export const webSocket = () => {
    const ws = new WebSocket('ws://' + simpleUrl);

    let sleep;
    sleep = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    ws.onerror = (e) => {
        console.trace(Tag, 'Error', e.message);
    };

    ws.onopen = (ws, event) => {
        console.trace(Tag, 'Socket open');
    };

    ws.onclose = () => {
        console.trace(Tag, 'Socket closed');
    };

    ws.onmessage = async function (event) {
        console.trace(Tag, 'Socket received message');
        const json = JSON.parse(event.data);
        const fromWS = {
            id: json.id,
            table: json.table,
            details: json.details,
            status: json.status,
            time: json.time,
            type: json.type
        };

        await sleep(5000);
        let message = 'Hey there! You receive a new order for table: *' + json.table + '* with status: *' + json.status + '*';
        Alert.alert('Notification', message);
    };
};
