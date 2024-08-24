import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AudioRecord from 'react-native-audio-record';
import { useColorScheme } from 'react-native';

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    } catch (err) {
      console.warn(err);
    }
  }
};

const initAudio = () => {
  const options = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: 'audio_recording.wav',
  };
  AudioRecord.init(options);
};

const startRecording = () => {
  AudioRecord.start();
};

const stopRecording = async () => {
  const audioFile = await AudioRecord.stop();
  return audioFile;
};

const App: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [recording, setRecording] = useState(false);

  const sendSOS = async () => {
    try {
      await requestPermissions();
      Geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        if (!recording) {
          initAudio();
          startRecording();
          setRecording(true);
        } else {
          const audioFile = await stopRecording();
          setRecording(false);

          Alert.alert(
            'SOS Alert Sent!',
            `Location: ${latitude}, ${longitude}\nAudio file: ${audioFile}`,
          );
        }
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send SOS alert.');
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#333' : '#FFF',
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>SOS App</Text>
        <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
          <Text style={styles.sosButtonText}>
            {recording ? 'Stop' : 'SOS'}
          </Text>
        </TouchableOpacity>
        {recording && <Text style={styles.recording}>Recording audio...</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  sosButton: {
    backgroundColor: 'red',
    borderRadius: 100, // Make the button round
    width: 200, // Width and height should be equal for a round button
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Adds a shadow on Android
    shadowColor: '#000', // Adds a shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  sosButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  recording: {
    marginTop: 8,
    fontSize: 18,
    color: 'red',
  },
});

export default App;
