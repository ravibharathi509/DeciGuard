import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { firestore, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function CreateLibrary() {
  const [libraryName, setLibraryName] = useState('');

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreate = async () => {
    if (!libraryName) {
      Alert.alert("Enter library name");
      return;
    }

    const user = auth.currentUser;

    try {
      await addDoc(collection(firestore, "libraries"), {
        libraryName,
        secretCode: generateCode(),
        createdBy: user?.uid,
        createdAt: Date.now()
      });

      Alert.alert("Success", "Library Created!");
    } catch (err) {
      Alert.alert("Error", "Failed");
    }
  };

  return (
    <View style={{padding:20}}>
      <Text>Create Library</Text>

      <TextInput 
        placeholder="Library Name"
        value={libraryName}
        onChangeText={setLibraryName}
        style={{borderWidth:1, marginBottom:20}}
      />

      <TouchableOpacity onPress={handleCreate}>
        <Text>Create</Text>
      </TouchableOpacity>
    </View>
  );
}