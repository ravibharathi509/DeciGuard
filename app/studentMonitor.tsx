import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { db, auth } from '../firebaseConfig';
import { ref, set } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { useLocalSearchParams } from 'expo-router';

export default function StudentMonitor() {
  const { deskId } = useLocalSearchParams(); // 🔥 dynamic deskId
  const [dbLevel, setDbLevel] = useState(0);
  const [status, setStatus] = useState("Silent");
  const [hasSpoken, setHasSpoken] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      Alert.alert("Error", "Logout failed");
    }
  };

  const speakWarning = async () => {
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) return;

    Speech.speak("Please maintain silence in the library", {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  useEffect(() => {
    let recording: Audio.Recording | null = null;

    const startMonitoring = async () => {
      if (!deskId) {
        Alert.alert("Error", "No Desk Connected");
        return;
      }

      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert("Permission Needed", "Mic permission required");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      recording = new Audio.Recording();

      try {
        await recording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        recording.setProgressUpdateInterval(500);

        recording.setOnRecordingStatusUpdate((status) => {
          if (status.metering != null) {
            const level = Math.floor(status.metering + 160);
            setDbLevel(level);

            const noiseStatus =
              level > 100 ? "LOUD" :
              level > 70 ? "MODERATE" :
              "SILENT";

            setStatus(noiseStatus);

            // 🔥 SEND TO FIREBASE
            set(ref(db, 'desks/' + deskId), {
              level: level,
              status: noiseStatus,
              time: Date.now()
            });

            // 🔊 Warning
            if (level > 100) {
              if (!hasSpoken) {
                speakWarning();
                setHasSpoken(true);
              }
            } else {
              Speech.stop();
              setHasSpoken(false);
            }
          }
        });

        await recording.startAsync();

      } catch (err) {
        console.error(err);
      }
    };

    startMonitoring();

    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [deskId]);

  return (
    <View style={[
      styles.container,
      { backgroundColor: dbLevel > 100 ? '#ff4d4d' : '#111' }
    ]}>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📚 DeciGuard</Text>

      <Text style={styles.desk}>Desk: {deskId}</Text>

      <Text style={styles.db}>{dbLevel} dB</Text>

      <Text style={styles.status}>{status}</Text>

      {dbLevel > 100 && (
        <Text style={styles.alert}>⚠️ PLEASE MAINTAIN SILENCE</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },

  logoutBtn: {
    position:'absolute',
    top:50,
    right:20,
    backgroundColor:'#444',
    padding:10,
    borderRadius:8
  },

  logoutText: { color:'#ff4d4d', fontWeight:'bold' },

  title: { fontSize:22, color:'#fff', marginBottom:10 },

  desk: { color:'#fff', marginBottom:10 },

  db: { fontSize:60, color:'#00ffcc', fontWeight:'bold' },

  status: { fontSize:24, color:'#00ff99', marginTop:10 },

  alert: { marginTop:20, color:'yellow', fontWeight:'bold' }
});