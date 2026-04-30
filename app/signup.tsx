import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter email & password");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      // 🔐 Create Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔥 Create Firestore entry (NO libraryId here)
      await setDoc(doc(firestore, "librarians", user.uid), {
        email: email,
        role: "librarian",
        createdAt: Date.now()
      });

      Alert.alert("Success", "Account created!");

      // 🔥 Go to chooseLibrary
      router.replace('/chooseLibrary');

    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Error", "Email already in use");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "Invalid email");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup 📚</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/login')} 
        style={{marginTop: 20}}
      >
        <Text style={{color: '#007bff', textAlign: 'center'}}>
          Already have account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 30, 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  input: { 
    borderBottomWidth: 1, 
    borderColor: '#ddd', 
    marginBottom: 20, 
    padding: 10, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#111', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold' 
  }
});