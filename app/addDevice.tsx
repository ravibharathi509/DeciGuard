import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { ref, set } from 'firebase/database';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AddDevice() {
  const [deskId, setDeskId] = useState('');
  const router = useRouter();

  // 🔥 libraryId receive pannrom (from login flow)
  const { libraryId } = useLocalSearchParams();

  const handleAdd = async () => {
    if (!deskId.trim()) {
      Alert.alert("Error", "Enter Desk ID");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    try {
      // 🔥 device create pannrom
      await set(ref(db, 'desks/' + deskId), {
        status: "SILENT",
        level: 0,
        userId: user.uid,          // 🔐 who created
        libraryId: libraryId,      // 🔥 which library
        createdAt: Date.now()
      });

      Alert.alert("Success", `Device ${deskId} added!`);
      setDeskId('');
      router.back();

    } catch (error) {
      Alert.alert("Error", "Failed to add device");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Add Device</Text>

      <TextInput
        placeholder="Enter Desk ID (ex: desk1)"
        value={deskId}
        onChangeText={setDeskId}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Device</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{marginTop: 15}}>
        <Text style={{textAlign:'center', color:'#666'}}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20, backgroundColor:'#fff' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:25, textAlign:'center' },
  input: { borderWidth:1, borderColor:'#ccc', padding:12, borderRadius:10, marginBottom:20 },
  button: { backgroundColor:'#007bff', padding:15, borderRadius:10 },
  buttonText: { color:'#fff', textAlign:'center', fontWeight:'bold' }
});