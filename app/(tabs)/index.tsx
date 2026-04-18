import { db } from '../../firebaseConfig';
import { ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

export default function Index() {
  const [dbLevel, setDbLevel] = useState(0);
  const [status, setStatus] = useState("Silent");
  const [hasSpoken, setHasSpoken] = useState(false);

  // 🔊 Voice function 
  const speakWarning = async () => {
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) return; // already speakingனா skip

    Speech.speak("Please maintain silence in the library", {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  useEffect(() => {
    startMonitoring();
  }, []);

  const startMonitoring = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== 'granted') return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();

    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    recording.setProgressUpdateInterval(500);

    recording.setOnRecordingStatusUpdate((status) => {
      if (status.metering != null) {
        const level = Math.floor(status.metering + 160);
        setDbLevel(level);
        const deskId = "desk1"; // 🔥 unique id

  // 🔥 FIREBASE SEND
  set(ref(db, 'desks/' + deskId), {
    level: level,
    status: level > 100 ? "LOUD" : level > 70 ? "MODERATE" : "SILENT",
    time: Date.now()
  });


        // 🔥 MAIN LOGIC
        if (level > 100 && !hasSpoken) {
          setStatus("TOO LOUD!");
          speakWarning();
          setHasSpoken(true); // speak only once
        } 
        else if (level > 70) {
          setStatus("Moderate Noise");
        } 
        else {
          setStatus("Silent");

          // ✅ IMPORTANT FIX
          Speech.stop();        // 🛑 stop voice immediately
          setHasSpoken(false);  // 🔄 reset for next alert
        }
      }
    });

    await recording.startAsync();
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: dbLevel > 100 ? '#ff4d4d' : '#111' }
    ]}>
      <Text style={styles.title}>📚 DeciGuard Smart Library</Text>

      <Text style={styles.db}>{dbLevel} dB</Text>

      <Text style={[
        styles.status,
        { color: dbLevel > 100 ? 'red' : '#00ff99' }
      ]}>
        {status}
      </Text>

      {dbLevel > 100 && (
        <Text style={styles.alert}>
          ⚠️ PLEASE MAINTAIN SILENCE!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 30,
  },
  db: {
    fontSize: 50,
    color: '#00ffcc',
  },
  status: {
    fontSize: 24,
    marginTop: 10,
  },
  alert: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'yellow',
  },
});