import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { firestore, auth } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function ChooseLibrary() {
  const [code, setCode] = useState('');
  const router = useRouter();

  // 🔐 Ensure user logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      }
    });
    return unsub;
  }, []);

  // 🔥 Generate Secret Code
  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // ➕ CREATE LIBRARY
  const handleCreate = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    const newCode = generateCode();

    try {
      // 1️⃣ Create library
      const docRef = await addDoc(collection(firestore, "libraries"), {
        libraryName: "My Library",
        secretCode: newCode,
        createdBy: user.uid,
        createdAt: Date.now()
      });

      // 2️⃣ Attach libraryId to user
      await updateDoc(doc(firestore, "librarians", user.uid), {
        libraryId: docRef.id
      });

      Alert.alert("Success", `Library Created!\nCode: ${newCode}`);

      router.replace('/librarianDashboard');

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Library create panna mudiyala");
    }
  };

  // 🔑 JOIN LIBRARY
  const handleJoin = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    if (!code.trim()) {
      Alert.alert("Error", "Enter Secret Code");
      return;
    }

    try {
      const q = query(
        collection(firestore, "libraries"),
        where("secretCode", "==", code.trim().toUpperCase())
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        const libId = snap.docs[0].id;

        // 🔥 Attach library to user
        await updateDoc(doc(firestore, "librarians", user.uid), {
          libraryId: libId
        });

        router.replace('/librarianDashboard');

      } else {
        Alert.alert("Invalid Code");
      }

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Join failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Library</Text>

      {/* CREATE */}
      <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
        <Text style={styles.btnText}>➕ Create New Library</Text>
      </TouchableOpacity>

      {/* JOIN */}
      <TextInput
        placeholder="Enter Secret Code"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        autoCapitalize="characters"
      />

      <TouchableOpacity style={styles.joinBtn} onPress={handleJoin}>
        <Text style={styles.btnText}>🔑 Join Library</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex:1, 
    justifyContent:'center', 
    padding:20 
  },

  title: { 
    fontSize:22, 
    fontWeight:'bold', 
    marginBottom:20, 
    textAlign:'center' 
  },

  createBtn: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },

  joinBtn: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 10
  }
});