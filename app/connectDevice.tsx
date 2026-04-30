import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ConnectDevice() {
  const [deskId, setDeskId] = useState('');
  const router = useRouter();

  const handleConnect = () => {
    if (!deskId.trim()) {
      Alert.alert("Error", "Enter Desk ID");
      return;
    }

    // 🔥 go to monitor with deskId
    router.replace({
      pathname: '/studentMonitor',
      params: { deskId: deskId.trim() }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📡 Connect Device</Text>

      <TextInput
        placeholder="Enter Desk ID (ex: desk1)"
        value={deskId}
        onChangeText={setDeskId}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleConnect}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20 },
  title: { fontSize:22, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  input: { borderWidth:1, padding:12, borderRadius:10, marginBottom:20 },
  button: { backgroundColor:'#007bff', padding:15, borderRadius:10 },
  buttonText: { color:'#fff', textAlign:'center', fontWeight:'bold' }
});