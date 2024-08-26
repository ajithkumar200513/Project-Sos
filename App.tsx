// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import Pusher from 'pusher-js/react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Check network connectivity
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected || false);
    });

    // Initialize Pusher
    const pusher = new Pusher('daf3f54495b0ad49389a', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('sos-channel');
    channel.bind('sos-alert', (data: any) => {
      Alert.alert('SOS Alert', data.message);
    });

    return () => {
      pusher.unsubscribe('sos-channel');
      unsubscribe();
    };
  }, []);

  const handleSOS = async () => {
    if (!connected) {
      Alert.alert('Error', 'No network connection');
      return;
    }

    try {
      await axios.post('http://192.168.1.105:5000/send-alert', {
        message: 'SOS Alert: Immediate attention required!',
      });
      Alert.alert('Success', 'SOS alert sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to send SOS alert');
    }
  };

  return React.createElement(
    View,
    { style: styles.container },
    React.createElement(Text, { style: styles.header }, 'SOS App'),
    React.createElement(Button, { title: 'Send SOS Alert', onPress: handleSOS })
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default App;
