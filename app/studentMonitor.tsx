import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { db } from '../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';
import { useLocalSearchParams } from 'expo-router';

export default function StudentMonitor() {
  const { deskId } = useLocalSearchParams();

  const [connected, setConnected] = useState(false);
  const [dbLevel, setDbLevel] = useState(0);
  const [status, setStatus] = useState('SILENT');

  const recordingRef = useRef<any>(null);

  const stopMic = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
    } catch {}

    Speech.stop();
    setDbLevel(0);
    setStatus('SILENT');
  };

  const startMic = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      const recording = new Audio.Recording();
      recordingRef.current = recording;

      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recording.setProgressUpdateInterval(500);

      recording.setOnRecordingStatusUpdate(async (rec) => {
        if (rec.metering == null) return;

        const level = Math.floor(rec.metering + 160);

        let noise = 'SILENT';
        if (level > 100) noise = 'LOUD';
        else if (level > 70) noise = 'MODERATE';

        setDbLevel(level);
        setStatus(noise);

        await update(ref(db, 'desks/' + deskId), {
          level,
          status: noise,
          connected: true,
          lastSeen: Date.now()
        });

        if (level > 100) {
          Speech.speak('Please maintain silence');
        }
      });

      await recording.startAsync();

    } catch {}
  };

  useEffect(() => {
    const deskRef = ref(db, 'desks/' + deskId);

    const unsub = onValue(deskRef, async (snap) => {
      const data = snap.val();
      if (!data) return;

      // Start request
      if (data.connectRequest === true && data.connected !== true) {
        await update(deskRef, {
          connectRequest: false,
          connected: true
        });

        setConnected(true);
        startMic();
      }

      // Stop request
      if (data.connected === false) {
        setConnected(false);
        await stopMic();
      }
    });

    return () => {
      unsub();
      stopMic();
    };
  }, []);

  return (
    <View style={[
      styles.container,
      { backgroundColor: connected ? '#111' : '#333' }
    ]}>
      <Text style={styles.title}>📚 DeciGuard</Text>

      <Text style={styles.text}>Desk: {deskId}</Text>

      <Text style={styles.text}>
        {connected ? '🟢 Connected' : '🟡 Waiting Librarian'}
      </Text>

      <Text style={styles.db}>{dbLevel} dB</Text>

      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  title:{
    color:'#fff',
    fontSize:24,
    fontWeight:'bold'
  },
  text:{
    color:'#fff',
    marginTop:10
  },
  db:{
    color:'#00ffcc',
    fontSize:58,
    fontWeight:'bold',
    marginTop:20
  },
  status:{
    color:'#fff',
    fontSize:24,
    marginTop:10
  }
});